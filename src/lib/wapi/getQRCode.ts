
import { supabase } from "@/integrations/supabase/client";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";
import { WapiInstance } from "./types";

export async function getQRCode(instanceId: string): Promise<string | null> {
  try {
    let { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Erro ao buscar instância:', error);
      throw error;
    }

    if (!instance?.connection_key) {
      throw new Error('Instância não encontrada ou não configurada');
    }

    // 1. Obter QR code da W-API
    const apiEndpoint = `${WAPI_ENDPOINT}/api/${WAPI_ID_ADM}/instance/qr/${instance.connection_key}`;
    console.log('Obtendo QR code:', { endpoint: apiEndpoint });

    const response = await fetch(apiEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': WAPI_ID_ADM
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao obter QR code:', errorData);
      throw new Error(errorData.message || 'Erro ao obter QR code');
    }

    const data = await response.json();
    console.log('Resposta do QR code:', {
      success: !!data.qrcode,
      status: data.status
    });

    if (!data.qrcode) {
      throw new Error('QR code não disponível');
    }

    // 2. Formatar e salvar QR code
    let formattedQRCode = data.qrcode;
    if (!formattedQRCode.startsWith('data:image/')) {
      formattedQRCode = `data:image/png;base64,${formattedQRCode}`;
    }

    // 3. Atualizar no Supabase
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({ 
        qr_code: formattedQRCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    if (updateError) {
      console.error('Erro ao atualizar QR code:', updateError);
    }

    return formattedQRCode;

  } catch (error) {
    console.error('Erro ao obter QR code:', error);
    throw error;
  }
}
