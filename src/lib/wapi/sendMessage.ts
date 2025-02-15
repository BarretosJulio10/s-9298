
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";
import { supabase } from "@/integrations/supabase/client";

interface SendMessageParams {
  phone: string;
  message: string;
  instanceId: string;
  imageUrl?: string;
  clientId: string;
  invoiceId?: string;
  companyId: string;
}

export async function sendMessage({ 
  phone, 
  message, 
  instanceId, 
  imageUrl,
  clientId,
  invoiceId,
  companyId
}: SendMessageParams): Promise<boolean> {
  try {
    console.log('Enviando mensagem via WhatsApp:', {
      phone,
      message: message.substring(0, 50) + '...',
      instanceId,
      hasImage: !!imageUrl
    });

    const formattedPhone = phone.replace(/\D/g, '');
    
    // Registrar a mensagem antes de enviar
    const { data: messageRecord, error: messageError } = await supabase
      .from('whatsapp_messages')
      .insert({
        company_id: companyId,
        client_id: clientId,
        invoice_id: invoiceId,
        instance_id: instanceId,
        message,
        type: imageUrl ? 'image' : 'text',
      })
      .select()
      .single();

    if (messageError) {
      console.error('Erro ao registrar mensagem:', messageError);
      throw messageError;
    }

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
        // Atualizar status da mensagem como falha
        await supabase
          .from('whatsapp_messages')
          .update({ 
            status: 'failed',
            error_message: errorData.message || 'Erro ao enviar imagem'
          })
          .eq('id', messageRecord.id);
          
        console.error('Erro ao enviar imagem:', errorData);
        throw new Error(errorData.message || 'Erro ao enviar imagem');
      }

      // Atualizar status da mensagem como enviada
      await supabase
        .from('whatsapp_messages')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', messageRecord.id);

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
      // Atualizar status da mensagem como falha
      await supabase
        .from('whatsapp_messages')
        .update({ 
          status: 'failed',
          error_message: errorData.message || 'Erro ao enviar mensagem'
        })
        .eq('id', messageRecord.id);

      console.error('Erro ao enviar mensagem:', errorData);
      throw new Error(errorData.message || 'Erro ao enviar mensagem');
    }

    // Atualizar status da mensagem como enviada
    await supabase
      .from('whatsapp_messages')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', messageRecord.id);

    const data = await response.json();
    console.log('Resposta do envio:', data);

    return true;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}
