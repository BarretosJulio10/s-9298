
import { supabase } from "@/integrations/supabase/client";
import { WapiInstance } from "./types";

export async function disconnectInstance(instanceId: string): Promise<boolean> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;
    if (!instance.info_api) {
      return false;
    }

    const info = instance.info_api as WapiInstance['info_api'];
    if (!info) return false;

    const response = await fetch(
      `https://${info.host}/instance/logout?connectionKey=${info.connectionKey}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${info.token}`
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
