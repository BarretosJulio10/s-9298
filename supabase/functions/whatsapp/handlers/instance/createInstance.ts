
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { corsHeaders } from "../../../_shared/cors.ts";

export async function createInstance(headers: HeadersInit, companyId: string): Promise<Response> {
  try {
    console.log("Iniciando criação de instância para empresa:", companyId);
    
    const connectionKey = `instance_${companyId}_${Date.now()}`; // Chave única por empresa
    const wapiHeaders = await getHeaders(supabaseClient, companyId);
    const createInstanceUrl = `${endpoints.createInstance}`;
    
    const requestBody = {
      connectionKey,
      webhook: null
    };
    
    console.log("URL de criação:", createInstanceUrl);
    console.log("Corpo da requisição:", requestBody);
    
    const response = await fetch(createInstanceUrl, {
      method: "POST",
      headers: wapiHeaders,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro na resposta da API:", errorData);
      throw new Error(`Erro ao criar instância: ${errorData || response.status}`);
    }

    const data = await response.json();
    console.log("Instância criada com sucesso:", data);

    // Registrar o log
    const { error: logError } = await supabaseClient
      .from('whatsapp_logs')
      .insert({
        company_id: companyId,
        instance_key: connectionKey,
        event_type: 'create_instance',
        status: 'success',
        message: 'Instância criada com sucesso'
      });

    if (logError) {
      console.error("Erro ao salvar log:", logError);
    }

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .upsert({
        company_id: companyId,
        instance_key: connectionKey,
        name: `Conexão ${connectionKey.substring(0, 8)}`,
        is_connected: false,
        last_connection_date: new Date().toISOString()
      });

    if (dbError) {
      console.error("Erro ao salvar conexão no banco:", dbError);
      throw new Error("Erro ao salvar conexão no banco de dados");
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
