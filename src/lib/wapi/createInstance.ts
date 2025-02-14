
import { supabase } from "@/integrations/supabase/client";
import { WAPI_ENDPOINT, WAPI_ID_ADM } from "./config";
import { WapiInstance } from "./types";

export async function createInstance(name: string): Promise<WapiInstance> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error('Usuário não autenticado');

    const company_id = user.id;

    // 1. Criar instância na W-API
    const apiEndpoint = `${WAPI_ENDPOINT}/api/${WAPI_ID_ADM}/instance/create`;
    console.log('Criando instância na W-API:', {
      endpoint: apiEndpoint,
      instanceName: name
    });

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': WAPI_ID_ADM
      },
      body: JSON.stringify({
        instanceName: name,
        token: WAPI_ID_ADM,
        qrcode: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(errorData.message || 'Erro ao criar instância na W-API');
    }

    const data = await response.json();
    console.log('Resposta da W-API:', data);

    if (!data.instance || !data.instance.instanceId) {
      throw new Error('Resposta inválida da W-API');
    }

    // 2. Salvar no Supabase
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        company_id,
        host: WAPI_ENDPOINT,
        connection_key: data.instance.instanceId,
        api_token: WAPI_ID_ADM,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      throw error;
    }

    return {
      id: instance.id,
      name: instance.name,
      etiqueta: instance.etiqueta,
      status: instance.status,
      qr_code: instance.qr_code,
      host: instance.host,
      connection_key: instance.connection_key,
      api_token: instance.api_token
    };

  } catch (error) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
