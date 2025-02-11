
import { supabase } from "@/integrations/supabase/client";

export async function disconnectInstance(instanceId: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de desconexão da instância:', instanceId);
    
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Erro ao buscar instância:', error);
      throw error;
    }

    if (!instance.host || !instance.connection_key || !instance.api_token) {
      console.error('Dados da API incompletos:', instance);
      await updateInstanceStatus(instanceId);
      return true;
    }

    console.log('Tentando desconectar instância com dados:', {
      host: instance.host,
      connectionKey: instance.connection_key
    });

    try {
      const response = await fetch(
        `https://${instance.host}/instance/logout?connectionKey=${instance.connection_key}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${instance.api_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
            'Cache-Control': 'no-cache'
          }
        }
      );

      const data = await response.json();
      console.log('Resposta da API de desconexão:', {
        status: response.status,
        data: data
      });

      // Se receber erro 403/401 ou resposta indicando que a connectionKey é inválida ou telefone não está conectado,
      // consideramos como sucesso já que o objetivo era desconectar
      if (!response.ok) {
        if (response.status === 401 || 
            response.status === 403 ||
            data?.message?.toLowerCase().includes('não está conectado') ||
            data?.message?.toLowerCase().includes('não encontrada') ||
            data?.message?.toLowerCase().includes('inválida')) {
          console.log('Instância já estava desconectada, connectionKey inválida ou não existe mais - prosseguindo com atualização do status');
        } else {
          console.error('Erro inesperado na resposta da API:', {
            status: response.status,
            data: data
          });
          return false;
        }
      }
    } catch (fetchError) {
      // Se houver erro de rede/CORS, também consideramos que a instância está desconectada
      console.log('Erro ao tentar acessar API (possível erro CORS ou rede) - considerando instância como desconectada:', fetchError);
    }

    await updateInstanceStatus(instanceId);
    console.log('Instância desconectada com sucesso');
    return true;

  } catch (error) {
    console.error('Erro ao desconectar instância:', error);
    return false;
  }
}

async function updateInstanceStatus(instanceId: string) {
  const { error: updateError } = await supabase
    .from('whatsapp_instances')
    .update({ 
      status: 'disconnected',
      updated_at: new Date().toISOString(),
      connection_key: null,
      api_token: null,
      host: null
    })
    .eq('id', instanceId);

  if (updateError) {
    console.error('Erro ao atualizar status no banco:', updateError);
    throw updateError;
  }
}
