
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

    const response = await fetch(`${WAPI_ENDPOINT}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${WAPI_ID_ADM}`,
        'Origin': window.location.origin,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        instanceName: name,
        token: WAPI_ID_ADM,
        qrcode: true,
        number: "", // número opcional
        webhook: "", // webhook opcional
      })
    });

    const data = await response.json();
    console.log('Resposta completa da API:', data);

    // Verifica se há erro na resposta da API
    if (!response.ok || data.error) {
      console.error('Erro detalhado da API:', data);
      throw new Error(data.message || 'Erro ao criar instância no W-API');
    }

    // Verifica se os dados necessários estão presentes
    if (!data.hash || !data.apikey) {
      console.error('Dados incompletos da API:', data);
      throw new Error('Resposta da API incompleta ou inválida');
    }

    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .insert({
        name,
        company_id,
        host: WAPI_ENDPOINT,
        connection_key: data.hash,
        api_token: data.apikey,
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
    console.error('Erro detalhado ao criar instância:', error);
    throw error;
  }
}
