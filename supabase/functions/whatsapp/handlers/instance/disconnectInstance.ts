
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { createSuccessResponse, createErrorResponse, logWhatsAppEvent, getCompanyIdFromInstanceKey } from "../../utils/handlers.ts";

export async function disconnectInstance(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Desconectando instância:", instanceKey);

    const companyId = await getCompanyIdFromInstanceKey(instanceKey);
    const wapiHeaders = await getHeaders(supabaseClient, companyId);
    
    const response = await fetch(`${endpoints.deleteInstance}/${instanceKey}`, {
      method: "DELETE",
      headers: wapiHeaders
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao desconectar instância: ${response.status}`);
    }

    const data = await response.json();
    console.log("Instância desconectada com sucesso");

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .update({
        is_connected: false,
        last_connection_date: new Date().toISOString()
      })
      .eq('instance_key', instanceKey);

    if (dbError) {
      console.error("Erro ao atualizar status no banco:", dbError);
    }

    await logWhatsAppEvent({
      companyId,
      instanceKey,
      eventType: 'disconnect',
      status: 'success',
      message: 'Instância desconectada com sucesso'
    });

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

