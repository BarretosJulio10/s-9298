
import { supabaseClient } from "../../db.ts";
import { endpoints, getHeaders } from "../../config.ts";
import { createSuccessResponse, createErrorResponse, logWhatsAppEvent, getCompanyIdFromInstanceKey } from "../../utils/handlers.ts";

export async function generateQRCode(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Gerando QR Code para instância:", instanceKey);

    const companyId = await getCompanyIdFromInstanceKey(instanceKey);
    const wapiHeaders = await getHeaders(supabaseClient, companyId);
    
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

      await logWhatsAppEvent({
        companyId,
        instanceKey,
        eventType: 'generate_qrcode',
        status: 'success',
        message: 'QR Code gerado com sucesso'
      });
    }

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
}

