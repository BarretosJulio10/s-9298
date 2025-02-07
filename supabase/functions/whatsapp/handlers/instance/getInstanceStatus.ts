
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { corsHeaders } from "../../../_shared/cors.ts";

export async function getInstanceStatus(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Verificando status da instância:", instanceKey);

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

    const response = await fetch(`${endpoints.getStatus}/${instanceKey}`, {
      method: "GET",
      headers: wapiHeaders
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Status da instância:", data);

    if (data.status === 'connected' || data.status === 'disconnected') {
      const { error: dbError } = await supabaseClient
        .from('whatsapp_connections')
        .update({
          is_connected: data.status === 'connected',
          last_connection_date: new Date().toISOString()
        })
        .eq('instance_key', instanceKey);

      if (dbError) {
        console.error("Erro ao atualizar status no banco:", dbError);
      }

      // Registrar o log
      const { error: logError } = await supabaseClient
        .from('whatsapp_logs')
        .insert({
          company_id: connection.company_id,
          instance_key: instanceKey,
          event_type: 'check_status',
          status: data.status,
          message: `Status da instância: ${data.status}`
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
    console.error("Erro ao buscar status da instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
