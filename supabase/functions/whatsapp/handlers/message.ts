
import { endpoints, getHeaders } from "../config.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { supabaseClient } from "../db.ts";

export async function sendMessage(headers: HeadersInit, params: any): Promise<Response> {
  const { phone, message, instanceKey } = params;
  
  try {
    console.log("Enviando mensagem para:", phone);
    console.log("Conteúdo da mensagem:", message);

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

    const body = {
      number: phone.replace(/\D/g, ''), // Remove caracteres não numéricos
      text: message,
      channelId: "WHATSAPP" // Especifica o canal como WhatsApp
    };

    console.log("Corpo da requisição:", JSON.stringify(body));

    const response = await fetch(`${endpoints.sendMessage}`, {
      method: "POST",
      headers: wapiHeaders,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao enviar mensagem: ${response.status} - ${errorText}`);
    }

    let data;
    const responseText = await response.text();
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.warn("Resposta não é JSON válido:", responseText);
      data = { success: true, message: "Mensagem enviada" };
    }

    // Registrar o log
    const { error: logError } = await supabaseClient
      .from('whatsapp_logs')
      .insert({
        company_id: connection.company_id,
        instance_key: instanceKey,
        event_type: 'send_message',
        status: 'success',
        message: `Mensagem enviada para ${phone}`
      });

    if (logError) {
      console.error("Erro ao salvar log:", logError);
    }

    console.log("Mensagem enviada com sucesso:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido ao enviar mensagem" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
