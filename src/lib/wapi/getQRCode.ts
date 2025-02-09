
import { supabase } from "@/integrations/supabase/client";
import { WapiInstance } from "./types";

export async function getQRCode(instanceId: string): Promise<string | null> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.info_api) {
      console.error('Instância não configurada corretamente');
      throw new Error('Instância não configurada corretamente');
    }

    const info = instance.info_api as WapiInstance['info_api'];
    if (!info) throw new Error('Informações da API não encontradas');

    console.log('Obtendo QR code para instância:', instance);

    const response = await fetch(
      `https://${info.host}/instance/qrcode?connectionKey=${info.connectionKey}`,
      {
        headers: {
          'Authorization': `Bearer ${info.token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da API de QR code:', data);
    
    if (data.error) {
      console.error('Erro na resposta da API:', data.error);
      throw new Error('Erro ao gerar QR code');
    }

    if (!data.qrcode) {
      console.error('QR code não recebido da API');
      throw new Error('QR code não disponível no momento. Tente novamente.');
    }

    await supabase
      .from('whatsapp_instances')
      .update({ qr_code: data.qrcode })
      .eq('id', instanceId);

    return data.qrcode;

  } catch (error) {
    console.error('Erro ao obter QR code:', error);
    throw error;
  }
}

