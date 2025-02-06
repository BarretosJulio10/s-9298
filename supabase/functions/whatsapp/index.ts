
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const WAPI_ENDPOINT = "https://api.wapi.com.br";
const DEFAULT_TOKEN = '1716319589869x721327290780988000'; // Token default do W-API

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    console.log(`Processando ação ${action} com token W-API`);

    // Headers padrão para todas as requisições
    const headers = {
      "Authorization": `Bearer ${DEFAULT_TOKEN}`,
      "Content-Type": "application/json",
      ...corsHeaders
    };

    switch (action) {
      case "createInstance":
        return await createInstance(headers);
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

async function createInstance(headers: HeadersInit): Promise<Response> {
  try {
    console.log("Iniciando criação de instância...");
    
    const connectionKey = `instance_${Date.now()}`; // Gerando uma chave única
    
    const response = await fetch(`${WAPI_ENDPOINT}/manager/create?adm_key=${DEFAULT_TOKEN}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        connectionKey,
        webhook: {
          connectionWebhook: "",
          messageWebhook: "",
          messageStatusWebhook: "",
          groupWebhook: "",
          presenceWebhook: "",
          labelsWebhook: ""
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar instância: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resposta da criação de instância:", data);

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
    
    // De acordo com a documentação, o QR code é gerado durante a criação da instância
    // ou podemos solicitar um novo QR code usando este endpoint
    const response = await fetch(`${WAPI_ENDPOINT}/api/instance/qrcode/${instanceKey}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        image: true // Solicita o QR code em formato de imagem
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar QR code: ${response.status}`);
    }

    const data = await response.json();
    console.log("QR Code gerado com sucesso");

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
          delay: 1200 // Delay entre mensagens para evitar bloqueio
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

