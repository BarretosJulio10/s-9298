
import { supabaseClient } from "../db.ts";
import { WAPI_ENDPOINT, headers } from "../config.ts";
import { WhatsAppConnection } from "../types.ts";

export async function createInstance(headers: HeadersInit, companyId: string): Promise<Response> {
  try {
    console.log("Iniciando criação de instância para empresa:", companyId);
    
    const connectionKey = `instance_${companyId}_${Date.now()}`; // Chave única por empresa
    const createInstanceUrl = `${WAPI_ENDPOINT}/manager/create?adm_key=${headers.Authorization?.toString().split(' ')[1]}`;
    
    const requestBody = {
      connectionKey,
      webhook: null
    };
    
    console.log("URL de criação:", createInstanceUrl);
    console.log("Corpo da requisição:", requestBody);
    
    const response = await fetch(createInstanceUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro na resposta da API:", errorData);
      throw new Error(`Erro ao criar instância: ${errorData || response.status}`);
    }

    const data = await response.json();
    console.log("Instância criada com sucesso:", data);

    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .upsert({
        company_id: companyId,
        instance_key: connectionKey,
        name: requestBody.name || `Conexão ${connectionKey.substring(0, 8)}`,
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
    throw new Error("Falha ao criar instância do WhatsApp");
  }
}

export async function getInstanceStatus(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Verificando status da instância:", instanceKey);

    const response = await fetch(`${WAPI_ENDPOINT}/api/instance/status/${instanceKey}`, {
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
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar status da instância:", error);
    throw new Error("Falha ao buscar status da instância");
  }
}

export async function generateQRCode(headers: HeadersInit, instanceKey: string): Promise<Response> {
  try {
    console.log("Gerando QR Code para instância:", instanceKey);
    
    const response = await fetch(`${WAPI_ENDPOINT}/instance/getQrcode?connectionKey=${instanceKey}&syncContacts=enable&returnQrcode=enable`, {
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
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    throw new Error("Falha ao gerar QR Code");
  }
}

