
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

    // Deletar na API W-API primeiro
    const response = await fetch(`${WAPI_ENDPOINT}/api/deleteInstances?id=${WAPI_ID_ADM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        id: WAPI_ID_ADM,
        connectionKey: instance.connection_key
      })
    });

    if (!response.ok) {
      throw new Error('Falha ao deletar conexão na W-API');
    }

    // Se a deleção na W-API foi bem sucedida, deletar do banco de dados
    const { error: deleteError } = await supabase
      .rpc('delete_whatsapp_instance', { instance_id: instanceId });

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    console.error('Erro ao deletar instância:', error);
    return false;
  }
}
