
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
      await updateInstanceAsDisconnected(instanceId);
      return false;
    }

    try {
      const response = await fetch(
        `${instance.host}/api/instance/info?connectionKey=${instance.connection_key}`,
        {
          headers: {
            'Authorization': `Bearer ${instance.api_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
            'Cache-Control': 'no-cache'
          },
          mode: 'cors',
          credentials: 'omit'
        }
      );

      const data = await response.json();
      console.log('Status da instância:', data);
      
      // Lista de condições que indicam que a instância está desconectada
      const isDisconnected = 
        !response.ok || 
        data.error || 
        !data.connection_data?.phone_connected ||
        response.status === 403 ||
        response.status === 401;

      if (isDisconnected) {
        await updateInstanceAsDisconnected(instanceId);
        return false;
      }

      // Se chegou aqui, está conectado
      await supabase
        .from('whatsapp_instances')
        .update({ 
          status: 'connected',
          updated_at: new Date().toISOString()
        })
        .eq('id', instanceId);

      return true;

    } catch (fetchError) {
      console.error('Erro ao fazer requisição:', fetchError);
      await updateInstanceAsDisconnected(instanceId);
      return false;
    }

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return false;
  }
}

async function updateInstanceAsDisconnected(instanceId: string) {
  const { error } = await supabase
    .from('whatsapp_instances')
    .update({ 
      status: 'disconnected',
      updated_at: new Date().toISOString(),
      connection_key: null,
      api_token: null,
      host: null,
      qr_code: null
    })
    .eq('id', instanceId);

  if (error) {
    console.error('Erro ao atualizar status no banco:', error);
  }
}
