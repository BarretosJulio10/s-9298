
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { corsHeaders } from "../../../_shared/cors.ts";

export async function generateQRCode(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Gerando QR Code para instância:", instanceKey);

    // Buscar company_id baseado no instance_key
    const { data: connection } = await supabaseClient
      .from('whatsapp_connections')
      .select('company_id')
      .eq('instance_key', instanceKey)
      .single();

    if (!connection) {
      throw new Error("Conexão não encontrada");
    }

    const wapiHeaders = await getHeaders(supabaseClient, connection.company_id);
    
    const response = await fetch(`${endpoints.getQRCode}?connectionKey=${instanceKey}`, {
      method: "GET",
      headers: wapiHeaders
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao gerar QR code: ${response.status}`);
    }

    const data = await response.json();
    console.log("QR Code gerado com sucesso");

    if (data.qrcode) {
      const { error: dbError } = await supabaseClient
        .from('whatsapp_connections')
        .update({
          last_qr_code: data.qrcode
        })
        .eq('instance_key', instanceKey);

      if (dbError) {
        console.error("Erro ao salvar QR code no banco:", dbError);
      }

      // Registrar o log
      const { error: logError } = await supabaseClient
        .from('whatsapp_logs')
        .insert({
          company_id: connection.company_id,
          instance_key: instanceKey,
          event_type: 'generate_qrcode',
          status: 'success',
          message: 'QR Code gerado com sucesso'
        });

      if (logError) {
        console.error("Erro ao salvar log:", logError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
