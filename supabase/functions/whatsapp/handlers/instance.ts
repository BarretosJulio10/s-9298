
import { supabaseClient } from "../db.ts";
import { WAPI_ENDPOINT, endpoints } from "../config.ts";
import { corsHeaders } from "../../_shared/cors.ts";

export async function createInstance(headers: HeadersInit, companyId: string): Promise<Response> {
  try {
    console.log("Iniciando criação de instância para empresa:", companyId);
    
    const connectionKey = `instance_${companyId}_${Date.now()}`; // Chave única por empresa
    const createInstanceUrl = `${endpoints.createInstance}?adm_key=${headers.Authorization?.toString().split(' ')[1]}`;
    
    const requestBody = {
      connectionKey,
      webhook: null
    };
    
    console.log("URL de criação:", createInstanceUrl);
    console.log("Corpo da requisição:", requestBody);
    
    const response = await fetch(createInstanceUrl, {
      method: "POST",
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro na resposta da API:", errorData);
      throw new Error(`Erro ao criar instância: ${errorData || response.status}`);
    }

    const data = await response.json();
    console.log("Instância criada com sucesso:", data);

    // Registrar o log
    const { error: logError } = await supabaseClient
      .from('whatsapp_logs')
      .insert({
        company_id: companyId,
        instance_key: connectionKey,
        event_type: 'create_instance',
        status: 'success',
        message: 'Instância criada com sucesso'
      });

    if (logError) {
      console.error("Erro ao salvar log:", logError);
    }

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .upsert({
        company_id: companyId,
        instance_key: connectionKey,
        name: `Conexão ${connectionKey.substring(0, 8)}`,
        is_connected: false,
        last_connection_date: new Date().toISOString()
      });

    if (dbError) {
      console.error("Erro ao salvar conexão no banco:", dbError);
      throw new Error("Erro ao salvar conexão no banco de dados");
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function getInstanceStatus(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Verificando status da instância:", instanceKey);

    const response = await fetch(`${endpoints.getStatus}/${instanceKey}`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Status da instância:", data);

    if (data.status === 'connected' || data.status === 'disconnected') {
      const { error: dbError } = await supabaseClient
        .from('whatsapp_connections')
        .update({
          is_connected: data.status === 'connected',
          last_connection_date: new Date().toISOString()
        })
        .eq('instance_key', instanceKey);

      if (dbError) {
        console.error("Erro ao atualizar status no banco:", dbError);
      }

      // Registrar o log
      const { error: logError } = await supabaseClient
        .from('whatsapp_logs')
        .insert({
          company_id: (await supabaseClient.from('whatsapp_connections').select('company_id').eq('instance_key', instanceKey).single()).data?.company_id,
          instance_key: instanceKey,
          event_type: 'check_status',
          status: data.status,
          message: `Status da instância: ${data.status}`
        });

      if (logError) {
        console.error("Erro ao salvar log:", logError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar status da instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function generateQRCode(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Gerando QR Code para instância:", instanceKey);
    
    const response = await fetch(`${endpoints.getQRCode}?connectionKey=${instanceKey}&syncContacts=enable&returnQrcode=enable`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao gerar QR code: ${response.status}`);
    }

    const data = await response.json();
    console.log("QR Code gerado com sucesso");

    if (data.qrcode) {
      const { error: dbError } = await supabaseClient
        .from('whatsapp_connections')
        .update({
          last_qr_code: data.qrcode
        })
        .eq('instance_key', instanceKey);

      if (dbError) {
        console.error("Erro ao salvar QR code no banco:", dbError);
      }

      // Registrar o log
      const { error: logError } = await supabaseClient
        .from('whatsapp_logs')
        .insert({
          company_id: (await supabaseClient.from('whatsapp_connections').select('company_id').eq('instance_key', instanceKey).single()).data?.company_id,
          instance_key: instanceKey,
          event_type: 'generate_qrcode',
          status: 'success',
          message: 'QR Code gerado com sucesso'
        });

      if (logError) {
        console.error("Erro ao salvar log:", logError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function disconnectInstance(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Desconectando instância:", instanceKey);
    
    const response = await fetch(`${endpoints.deleteInstance}/${instanceKey}`, {
      method: "DELETE",
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao desconectar instância: ${response.status}`);
    }

    const data = await response.json();
    console.log("Instância desconectada com sucesso");

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .update({
        is_connected: false,
        last_connection_date: new Date().toISOString()
      })
      .eq('instance_key', instanceKey);

    if (dbError) {
      console.error("Erro ao atualizar status no banco:", dbError);
    }

    // Registrar o log
    const { error: logError } = await supabaseClient
      .from('whatsapp_logs')
      .insert({
        company_id: (await supabaseClient.from('whatsapp_connections').select('company_id').eq('instance_key', instanceKey).single()).data?.company_id,
        instance_key: instanceKey,
        event_type: 'disconnect',
        status: 'success',
        message: 'Instância desconectada com sucesso'
      });

    if (logError) {
      console.error("Erro ao salvar log:", logError);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao desconectar instância:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
