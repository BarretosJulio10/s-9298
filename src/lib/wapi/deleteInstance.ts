
import { supabase } from "@/integrations/supabase/client";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";

export async function deleteInstance(instanceId: string): Promise<boolean> {
  try {
    // Primeiro, buscar os dados da instância para ter as informações necessárias
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;

    // Deletar na API W-API primeiro usando o método DELETE com os parâmetros corretos
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
