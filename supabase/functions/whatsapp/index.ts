import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const WHATSAPP_API_ENDPOINT = "http://167.114.6.95/api/v1";

interface WhatsAppResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, instance, params } = await req.json();

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
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function checkStatus(instance: string): Promise<Response> {
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/status`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Token": instance,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function getQRCode(instance: string): Promise<Response> {
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/qr`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Token": instance,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function connectWhatsApp(instance: string): Promise<Response> {
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/connect`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Token": instance,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "Subscribe": ["Message"],
      "Immediate": false
    })
  });

  const data = await response.json();
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function disconnectWhatsApp(instance: string): Promise<Response> {
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/logout`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Token": instance,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function sendMessage(instance: string, params: any): Promise<Response> {
  const { phone, message } = params;
  const data = {
    Id: Math.floor(Math.random() * 9000000 + 1000000).toString(),
    Phone: phone,
    Body: message
  };

  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/send/text`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Token": instance,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();
  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

serve(handleRequest);