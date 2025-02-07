
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config/index.ts";
import { createSuccessResponse, createErrorResponse, logWhatsAppEvent } from "../../utils/handlers.ts";

export async function createInstance(headers: HeadersInit, companyId: string): Promise<Response> {
  try {
    console.log("Iniciando criação de instância para empresa:", companyId);
    
    const connectionKey = `instance_${companyId}_${Date.now()}`; 
    const wapiHeaders = await getHeaders(supabaseClient, companyId);
    const createInstanceUrl = `${endpoints.createInstance}`;
    
    // Gerar webhook_url e secret
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/whatsapp-webhook`;
    const webhookSecret = crypto.randomUUID();
    
    const requestBody = {
      connectionKey,
      webhook: {
        url: webhookUrl,
        secret: webhookSecret
      }
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

    await logWhatsAppEvent({
      companyId,
      instanceKey: connectionKey,
      eventType: 'create_instance',
      status: 'success',
      message: 'Instância criada com sucesso'
    });

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .upsert({
        company_id: companyId,
        instance_key: connectionKey,
        name: `Conexão ${connectionKey.substring(0, 8)}`,
        is_connected: false,
        webhook_url: webhookUrl,
        webhook_secret: webhookSecret,
        last_connection_date: new Date().toISOString()
      });

    if (dbError) {
      console.error("Erro ao salvar conexão no banco:", dbError);
      throw new Error("Erro ao salvar conexão no banco de dados");
    }

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

