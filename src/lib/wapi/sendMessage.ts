
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";

interface SendMessageParams {
  phone: string;
  message: string;
  instanceId: string;
  imageUrl?: string;
}

export async function sendMessage({ phone, message, instanceId, imageUrl }: SendMessageParams): Promise<boolean> {
  try {
    console.log('Enviando mensagem via WhatsApp:', {
      phone,
      message: message.substring(0, 50) + '...',
      instanceId,
      hasImage: !!imageUrl
    });

    const formattedPhone = phone.replace(/\D/g, '');
    
    // Se tiver imagem, envia primeiro a imagem
    if (imageUrl) {
      const imageResponse = await fetch(`${WAPI_ENDPOINT}/api/${WAPI_ID_ADM}/message/image/${instanceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': WAPI_ID_ADM
        },
        body: JSON.stringify({
          number: formattedPhone,
          imageUrl: imageUrl,
          caption: message,
          apiKey: WAPI_ID_ADM
        })
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json();
        console.error('Erro ao enviar imagem:', errorData);
        throw new Error(errorData.message || 'Erro ao enviar imagem');
      }

      return true;
    }

    // Se não tiver imagem, envia só o texto
    const response = await fetch(`${WAPI_ENDPOINT}/api/${WAPI_ID_ADM}/message/text/${instanceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': WAPI_ID_ADM
      },
      body: JSON.stringify({
        number: formattedPhone,
        message: message,
        apiKey: WAPI_ID_ADM
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar mensagem:', errorData);
      throw new Error(errorData.message || 'Erro ao enviar mensagem');
    }

    const data = await response.json();
    console.log('Resposta do envio:', data);

    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}
