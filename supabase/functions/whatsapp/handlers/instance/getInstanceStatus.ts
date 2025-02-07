
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { createSuccessResponse, createErrorResponse, logWhatsAppEvent, getCompanyIdFromInstanceKey } from "../../utils/handlers.ts";

export async function getInstanceStatus(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Verificando status da instância:", instanceKey);

    const companyId = await getCompanyIdFromInstanceKey(instanceKey);
    const wapiHeaders = await getHeaders(supabaseClient, companyId);

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

      await logWhatsAppEvent({
        companyId,
        instanceKey,
        eventType: 'check_status',
        status: data.status,
        message: `Status da instância: ${data.status}`
      });
    }

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

