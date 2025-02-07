
import { endpoints, getHeaders } from "../config.ts";
import { createSuccessResponse, createErrorResponse, logWhatsAppEvent, getCompanyIdFromInstanceKey } from "../utils/handlers.ts";

export async function sendMessage(headers: HeadersInit, params: any): Promise<Response> {
  const { phone, message, instanceKey } = params;
  
  try {
    console.log("Enviando mensagem para:", phone);
    console.log("Conteúdo da mensagem:", message);

    const companyId = await getCompanyIdFromInstanceKey(instanceKey);
    const wapiHeaders = await getHeaders(supabaseClient, companyId);

    const body = {
      number: phone.replace(/\D/g, ''),
      text: message,
      channelId: "WHATSAPP"
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

    await logWhatsAppEvent({
      companyId,
      instanceKey,
      eventType: 'send_message',
      status: 'success',
      message: `Mensagem enviada para ${phone}`
    });

    console.log("Mensagem enviada com sucesso:", data);

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

