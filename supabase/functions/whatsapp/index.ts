
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const WAPI_ENDPOINT = "https://api.wapi.com.br";

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, token, params } = await req.json();
    console.log(`Processando ação ${action} com token W-API`);

    // Headers padrão para todas as requisições
    const headers = {
      "Authorization": `Bearer ${token}`,
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
    const response = await fetch(`${WAPI_ENDPOINT}/api/instance/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "WhatsApp Instance",
        qrcode: true,
        webhook: {
          url: "",
          events: ["message", "status"]
        }
      })
    });

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
    const response = await fetch(`${WAPI_ENDPOINT}/api/instance/status/${instanceKey}`, {
      headers
    });

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
    const response = await fetch(`${WAPI_ENDPOINT}/api/instance/qrcode/${instanceKey}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        image: true
      })
    });

    const data = await response.json();
    console.log("QR Code gerado");

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

    const data = await response.json();
    console.log("Mensagem enviada:", data);

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
