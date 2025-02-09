
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

    console.log('Criando nova instância do WhatsApp...');

    const response = await fetch(`${WAPI_ENDPOINT}/createNewConnection?id=${WAPI_ID_ADM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Resposta da API de criação:', data);

    if (!response.ok) {
      if (data.message === "Limite de conexões atingido.") {
        throw new Error('Limite de conexões atingido. Por favor, entre em contato com o suporte para aumentar seu limite.');
      }
      throw new Error(data.message || 'Erro ao criar instância no W-API');
    }

    if (data.error) {
      console.error('Erro na resposta da API:', data.error);
      throw new Error(data.message || 'Erro ao criar instância no W-API');
    }

    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        company_id,
        host: data.host,
        connection_key: data.connectionKey,
        api_token: data.token,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: instance.id,
      name: instance.name,
      etiqueta: instance.etiqueta,
      info_api: {
        host: instance.host,
        connectionKey: instance.connection_key,
        token: instance.api_token
      },
      status: instance.status,
      qr_code: instance.qr_code
    };

  } catch (error) {
    console.error('Erro ao criar instância:', error);
    throw error;
  }
}
