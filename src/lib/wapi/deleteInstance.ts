
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

    // Se a instância estiver conectada ou com status pending, primeiro fazer logout
    if (instance.status === 'connected' || instance.status === 'pending') {
      console.log('Instância está', instance.status, ', realizando logout...');
      const disconnected = await disconnectInstance(instanceId);
      
      // Aguardar 5 segundos para garantir que a desconexão foi processada
      console.log('Aguardando processamento da desconexão...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Verificar novamente o status após a tentativa de desconexão
      const { data: updatedInstance } = await supabase
        .from('whatsapp_instances')
        .select('status')
        .eq('id', instanceId)
        .single();
        
      if (updatedInstance?.status === 'connected') {
        console.error('Não foi possível desconectar a instância');
        throw new Error('Não foi possível desconectar a instância');
      }
    }

    // Se não tiver connection_key, podemos deletar direto do banco
    if (!instance.connection_key) {
      console.log('Instância não tem connection_key, removendo do banco...');
      const { error: deleteError } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', instanceId);

      if (deleteError) throw deleteError;
      return true;
    }

    try {
      // Tentar deletar a conexão na W-API
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

      // Se recebemos qualquer erro da API, mas a mensagem indica que a connectionKey não existe,
      // podemos prosseguir com a deleção local
      if (!response.ok) {
        const shouldProceedWithLocalDelete = 
          responseData.message?.includes('não encontrada') ||
          responseData.message?.includes('não existe') ||
          responseData.message?.includes('está online');

        if (!shouldProceedWithLocalDelete) {
          console.error('Erro ao deletar na W-API:', responseData);
          throw new Error(responseData.message || 'Falha ao deletar conexão na W-API');
        }
        
        console.log('Prosseguindo com deleção local após erro da API:', responseData.message);
      }
    } catch (apiError) {
      // Se houver erro de conexão com a API, vamos logar e prosseguir com deleção local
      console.warn('Erro ao tentar deletar na W-API, prosseguindo com deleção local:', apiError);
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
