
import { supabase } from "@/integrations/supabase/client";
import { WapiInstance } from "./types";

export async function getQRCode(instanceId: string): Promise<string | null> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Erro ao buscar instância:', error);
      throw error;
    }

    if (!instance?.host || !instance?.connection_key || !instance?.api_token) {
      console.error('Dados da API incompletos:', instance);
      throw new Error('Instância não configurada corretamente');
    }

    console.log('Obtendo QR code para instância:', {
      host: instance.host,
      connectionKey: instance.connection_key
    });

    const response = await fetch(
      `https://${instance.host}/instance/qrcode?connectionKey=${instance.connection_key}`,
      {
        headers: {
          'Authorization': `Bearer ${instance.api_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', {
        status: response.status,
        data: errorData
      });
      
      if (response.status === 403) {
        throw new Error('Instância não encontrada ou não autorizada');
      }
      
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da API de QR code:', {
      success: !!data.qrcode,
      length: data.qrcode?.length
    });
    
    if (!data.qrcode) {
      console.error('QR code não recebido da API');
      throw new Error('QR code não disponível no momento');
    }

    let formattedQRCode = data.qrcode;
    if (!formattedQRCode.startsWith('data:image/')) {
      formattedQRCode = `data:image/png;base64,${formattedQRCode}`;
    }

    // Atualiza o QR code na instância
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({ 
        qr_code: formattedQRCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    if (updateError) {
      console.error('Erro ao atualizar QR code no banco:', updateError);
    }

    return formattedQRCode;

  } catch (error) {
    console.error('Erro ao obter QR code:', error);
    throw error;
  }
}
