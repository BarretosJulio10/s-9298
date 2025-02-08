
import { supabase } from "@/integrations/supabase/client";
import { WapiInstance } from "./types";

export async function getInstanceStatus(instanceId: string): Promise<boolean> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.info_api) {
      console.log('Instância não configurada corretamente');
      return false;
    }

    const info = instance.info_api as WapiInstance['info_api'];
    if (!info) return false;

    const response = await fetch(
      `https://${info.host}/instance/info?connectionKey=${info.connectionKey}`,
      {
        headers: {
          'Authorization': `Bearer ${info.token}`
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
