
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const WAPI_ENDPOINT = "https://painel.w-api.app";
const DEFAULT_TOKEN = '1716319589869x721327290780988000'; // Token W-API

// Inicializa o cliente Supabase
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface WebhookConfig {
  connectionWebhook?: string;
  messageWebhook?: string;
  messageStatusWebhook?: string;
  groupWebhook?: string;
  presenceWebhook?: string;
  labelsWebhook?: string;
}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    console.log(`Processando ação ${action} com params:`, params);

    const headers = {
      "Authorization": `Bearer ${DEFAULT_TOKEN}`,
      "Content-Type": "application/json",
      ...corsHeaders
    };

    switch (action) {
      case "createInstance":
        return await createInstance(headers, params.companyId);
      case "getInstanceStatus":
        return await getInstanceStatus(headers, params.instanceKey);
      case "generateQRCode":
        return await generateQRCode(headers, params.instanceKey);
      case "sendMessage":
        return await sendMessage(headers, params);
      default:
        return new Response(
          JSON.stringify({ success: false, message: "Ação inválida" }),
          { status: 400, headers }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function createInstance(headers: HeadersInit, companyId: string): Promise<Response> {
  try {
    console.log("Iniciando criação de instância para empresa:", companyId);
    
    const connectionKey = `instance_${companyId}_${Date.now()}`; // Chave única por empresa
    const createInstanceUrl = `${WAPI_ENDPOINT}/manager/create?adm_key=${DEFAULT_TOKEN}`;
    
    const requestBody = {
      connectionKey,
      webhook: null // Mantendo null por enquanto, podemos expandir depois
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

    // Salvar a conexão no banco de dados
    const { error: dbError } = await supabaseClient
      .from('whatsapp_connections')
      .upsert({
        company_id: companyId,
        instance_key: connectionKey,
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

async function getInstanceStatus(headers: HeadersInit, instanceKey: string): Promise<Response> {
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

    // Atualizar status no banco
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

async function generateQRCode(headers: HeadersInit, instanceKey: string): Promise<Response> {
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

    // Salvar QR code no banco
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

async function sendMessage(headers: HeadersInit, params: any): Promise<Response> {
  const { instanceKey, phone, message } = params;
  
  try {
    console.log("Enviando mensagem para:", phone);

    const response = await fetch(`${WAPI_ENDPOINT}/api/messages/text/${instanceKey}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        number: phone,
        message,
        options: {
          delay: 1200
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.status}`);
    }

    const data = await response.json();
    console.log("Mensagem enviada com sucesso:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    throw new Error("Falha ao enviar mensagem");
  }
}

serve(handleRequest);
