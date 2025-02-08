
import { supabase } from "@/integrations/supabase/client";

export interface WapiInstance {
  id: string;
  name: string;
  etiqueta?: string;
  connection_key?: string;
  host?: string;
  token?: string;
  status: 'disconnected' | 'connected' | 'pending';
  qr_code?: string;
}

const WAPI_ENDPOINT = "https://api-painel.w-api.app";
const WAPI_ID_ADM = "1716319589869x721327290780988000";

export async function createInstance(name: string): Promise<WapiInstance> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('Usuário não autenticado');

    const company_id = user.id;

    console.log('Criando nova instância do WhatsApp...');

    const response = await fetch(`${WAPI_ENDPOINT}/createNewConnection?id=${WAPI_ID_ADM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' // TODO: Adicionar token da sua conta W-API
      }
    });

    const data = await response.json();
    console.log('Resposta da API de criação:', data);

    if (data.error) {
      console.error('Erro na resposta da API:', data.error);
      throw new Error('Erro ao criar instância no W-API');
    }

    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        company_id,
        connection_key: data.connectionKey,
        host: data.host,
        token: data.token,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return instance;

  } catch (error) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}

export async function getInstanceStatus(instanceId: string): Promise<boolean> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.host || !instance.connection_key || !instance.token) {
      console.log('Instância não configurada corretamente');
      return false;
    }

    const response = await fetch(
      `https://${instance.host}/instance/info?connectionKey=${instance.connection_key}`,
      {
        headers: {
          'Authorization': `Bearer ${instance.token}`
        }
      }
    );

    const data = await response.json();
    console.log('Status da instância:', data);
    
    if (data.error || !data.connection_data?.phone_connected) {
      return false;
    }

    await supabase
      .from('whatsapp_instances')
      .update({ status: data.connection_data.phone_connected ? 'connected' : 'disconnected' })
      .eq('id', instanceId);

    return data.connection_data.phone_connected;

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return false;
  }
}

export async function getQRCode(instanceId: string): Promise<string | null> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.host || !instance.connection_key || !instance.token) {
      console.error('Instância não configurada corretamente');
      throw new Error('Instância não configurada corretamente');
    }

    console.log('Obtendo QR code para instância:', instance);

    const response = await fetch(
      `https://${instance.host}/instance/qrcode?connectionKey=${instance.connection_key}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${instance.token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da API de QR code:', data);
    
    // Com base no código PHP fornecido, vamos verificar o formato da resposta
    if (data.error) {
      console.error('Erro na resposta da API:', data.error);
      throw new Error('Erro ao gerar QR code');
    }

    if (!data.qrcode) {
      console.error('QR code não recebido da API');
      throw new Error('QR code não disponível no momento. Tente novamente.');
    }

    // Atualiza o QR code no banco de dados
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({ qr_code: data.qrcode })
      .eq('id', instanceId);

    if (updateError) {
      console.error('Erro ao atualizar QR code no banco:', updateError);
      throw updateError;
    }

    return data.qrcode;

  } catch (error) {
    console.error('Erro ao obter QR code:', error);
    throw error;
  }
}

export async function disconnectInstance(instanceId: string): Promise<boolean> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.host || !instance.connection_key || !instance.token) {
      return false;
    }

    const response = await fetch(
      `https://${instance.host}/instance/logout?connectionKey=${instance.connection_key}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${instance.token}`
        }
      }
    );

    const data = await response.json();
    console.log('Resposta da API de desconexão:', data);
    
    if (data.error) {
      return false;
    }

    await supabase
      .from('whatsapp_instances')
      .update({ status: 'disconnected' })
      .eq('id', instanceId);

    return true;

  } catch (error) {
    console.error('Erro ao desconectar instância:', error);
    return false;
  }
}
