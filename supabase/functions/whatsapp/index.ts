
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const WHATSAPP_API_ENDPOINT = "https://api.wapi.com.br";

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, instance, params } = await req.json();
    console.log(`Processando ação ${action} para instância ${instance}`);

    switch (action) {
      case "status":
        return await checkStatus(instance);
      case "qrcode":
        return await getQRCode(instance);
      case "connect":
        return await connectWhatsApp(instance);
      case "disconnect":
        return await disconnectWhatsApp(instance);
      case "sendMessage":
        return await sendMessage(instance, params);
      default:
        console.error(`Ação inválida: ${action}`);
        return new Response(
          JSON.stringify({ success: false, error: "Ação inválida" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function checkStatus(instance: string): Promise<Response> {
  console.log("Verificando status da instância:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/status`, {
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Resposta do status:", data);
  
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function getQRCode(instance: string): Promise<Response> {
  console.log("Gerando QR code para instância:", instance);
  
  // Parâmetros específicos da W-API para geração do QR code
  const params = {
    syncContacts: false,
    returnQrcode: true
  };
  
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/qrcode`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });

  const data = await response.json();
  console.log("Resposta da API:", data);

  if (data.qrcode) {
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          QRCode: data.qrcode
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ 
      success: false, 
      error: "Falha ao gerar QR code",
      details: data 
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function connectWhatsApp(instance: string): Promise<Response> {
  console.log("Conectando WhatsApp para instância:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/connect`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Resposta da conexão:", data);
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function disconnectWhatsApp(instance: string): Promise<Response> {
  console.log("Desconectando WhatsApp para instância:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Resposta da desconexão:", data);
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function sendMessage(instance: string, params: any): Promise<Response> {
  const { phone, message } = params;
  console.log("Enviando mensagem para instância:", instance, "para telefone:", phone);
  
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/messages/text`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      number: phone,
      message: message,
      options: {
        delay: 1200
      }
    })
  });

  const data = await response.json();
  console.log("Resposta do envio de mensagem:", data);
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

serve(handleRequest);
