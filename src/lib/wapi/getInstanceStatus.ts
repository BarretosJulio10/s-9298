
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
    if (!instance.host || !instance.connection_key || !instance.api_token) {
      console.log('Instância não configurada corretamente');
      return false;
    }

    const response = await fetch(
      `https://${instance.host}/instance/info?connectionKey=${instance.connection_key}`,
      {
        headers: {
          'Authorization': `Bearer ${instance.api_token}`
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
