
import { supabase } from "@/integrations/supabase/client";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";
import { disconnectInstance } from "./disconnectInstance";

export async function deleteInstance(instanceId: string): Promise<boolean> {
  try {
    // Primeiro, buscar os dados da instância
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance) return false;

    // Se a instância estiver conectada, primeiro fazer logout
    if (instance.status === 'connected') {
      const disconnected = await disconnectInstance(instanceId);
      if (!disconnected) {
        throw new Error('Não foi possível desconectar a instância');
      }
      
      // Aguardar um momento para garantir que a desconexão foi processada
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Agora podemos tentar deletar a conexão na W-API
    const response = await fetch(
      `${WAPI_ENDPOINT}/deleteConnection?connectionKey=${instance.connection_key}&id=${WAPI_ID_ADM}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          'Cache-Control': 'no-cache'
        }
      }
    );

    const responseData = await response.json();
    console.log('Resposta da API de deleção:', responseData);

    if (!response.ok) {
      console.error('Erro ao deletar na W-API:', await response.text());
      throw new Error('Falha ao deletar conexão na W-API');
    }

    // Se a deleção na W-API foi bem sucedida, deletar do banco de dados
    const { error: deleteError } = await supabase
      .from('whatsapp_instances')
      .delete()
      .eq('id', instanceId);

    if (deleteError) {
      console.error('Erro ao deletar no banco:', deleteError);
      throw deleteError;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar instância:', error);
    return false;
  }
}
