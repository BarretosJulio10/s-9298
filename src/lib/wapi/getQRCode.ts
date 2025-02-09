
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

    // Verifica se a instância existe e tem as informações necessárias
    if (!instance || !instance.host || !instance.connection_key || !instance.api_token) {
      console.error('Instância não configurada corretamente. Dados:', instance);
      throw new Error('Instância não configurada corretamente');
    }

    console.log('Obtendo QR code para instância:', instance);

    const response = await fetch(
      `https://${instance.host}/instance/qrcode?connectionKey=${instance.connection_key}`,
      {
        headers: {
          'Authorization': `Bearer ${instance.api_token}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da API de QR code:', data);
    
    if (data.error) {
      console.error('Erro na resposta da API:', data.error);
      throw new Error(data.message || 'Erro ao gerar QR code');
    }

    // Verifica se o QR code está presente e é uma string base64 válida
    if (!data.qrcode) {
      console.error('QR code não recebido da API');
      throw new Error('QR code não disponível no momento. Tente novamente.');
    }

    // Garante que a string base64 esteja formatada corretamente
    let formattedQRCode = data.qrcode;
    if (!formattedQRCode.startsWith('data:image/')) {
      // Se não for uma URL de dados completa, assume que é uma string base64 pura
      formattedQRCode = `data:image/png;base64,${formattedQRCode}`;
    }

    // Atualiza o QR code na instância
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({ qr_code: formattedQRCode })
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
