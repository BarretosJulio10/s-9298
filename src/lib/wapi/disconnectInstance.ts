
import { supabase } from "@/integrations/supabase/client";

export async function disconnectInstance(instanceId: string): Promise<boolean> {
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

    if (!instance.host || !instance.connection_key || !instance.api_token) {
      console.error('Dados da API incompletos:', instance);
      return false;
    }

    const response = await fetch(
      `https://${instance.host}/instance/logout?connectionKey=${instance.connection_key}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${instance.api_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    console.log('Resposta da API de desconexão:', data);

    // Se receber erro 401 ou resposta indicando que o telefone não está conectado,
    // consideramos como sucesso já que o objetivo era desconectar
    if (!response.ok) {
      if (response.status === 401 || 
          data?.message?.toLowerCase().includes('não está conectado') ||
          data?.message?.toLowerCase().includes('não encontrada')) {
        console.log('Instância já estava desconectada ou não existe mais');
      } else {
        console.error('Erro na resposta da API:', data);
        return false;
      }
    }

    // Atualiza o status para desconectado no banco de dados
    const { error: updateError } = await supabase
      .from('whatsapp_instances')
      .update({ status: 'disconnected' })
      .eq('id', instanceId);

    if (updateError) {
      console.error('Erro ao atualizar status no banco:', updateError);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Erro ao desconectar instância:', error);
    return false;
  }
}
