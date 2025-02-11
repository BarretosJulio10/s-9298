
import { supabase } from "@/integrations/supabase/client";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";
import { disconnectInstance } from "./disconnectInstance";

export async function deleteInstance(instanceId: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de deleção da instância:', instanceId);
    
    // Primeiro, buscar os dados da instância
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Erro ao buscar instância:', error);
      throw error;
    }
    
    if (!instance) {
      console.error('Instância não encontrada');
      return false;
    }

    console.log('Dados da instância encontrados:', {
      id: instance.id,
      status: instance.status,
      connectionKey: instance.connection_key
    });

    // Se a instância estiver conectada, primeiro fazer logout
    if (instance.status === 'connected') {
      console.log('Instância está conectada, realizando logout...');
      const disconnected = await disconnectInstance(instanceId);
      if (!disconnected) {
        console.error('Falha ao desconectar instância');
        throw new Error('Não foi possível desconectar a instância');
      }
      
      // Aguardar um momento para garantir que a desconexão foi processada
      console.log('Aguardando processamento da desconexão...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (!instance.connection_key) {
      console.log('Instância não tem connection_key, removendo do banco...');
      const { error: deleteError } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);

      if (deleteError) throw deleteError;
      return true;
    }

    // Agora podemos tentar deletar a conexão na W-API
    console.log('Deletando conexão na W-API...');
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
      if (response.status === 400 && responseData.message?.includes('não encontrada')) {
        console.log('Connection key não encontrada na API, prosseguindo com deleção local');
      } else if (response.status === 500 && responseData.message?.includes('online')) {
        console.error('Instância ainda está online na API');
        throw new Error('A instância ainda está online. Por favor, tente novamente.');
      } else {
        console.error('Erro ao deletar na W-API:', responseData);
        throw new Error(responseData.message || 'Falha ao deletar conexão na W-API');
      }
    }

    // Se chegamos aqui, podemos deletar do banco de dados
    console.log('Deletando instância do banco de dados...');
    const { error: deleteError } = await supabase
      .from('whatsapp_instances')
      .delete()
      .eq('id', instanceId);

    if (deleteError) {
      console.error('Erro ao deletar no banco:', deleteError);
      throw deleteError;
    }

    console.log('Instância deletada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao deletar instância:', error);
    throw error;
  }
}
