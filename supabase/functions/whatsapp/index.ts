import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const WHATSAPP_API_ENDPOINT = "https://api.w-api.app";

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
      case "configureWebhook":
        return await configureWebhook(instance, params);
      case "updateWebhookV3":
        return await updateWebhookV3(instance);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

async function checkStatus(instance: string): Promise<Response> {
  console.log("Checking status for instance:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/status`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Status response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function getQRCode(instance: string): Promise<Response> {
  console.log("Generating QR code for instance:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/qrcode?syncContacts=disable&returnQrcode=enable`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("QR code response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function updateWebhookV3(instance: string): Promise<Response> {
  console.log("Updating webhook to V3 for instance:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/instance/updateWebhookV3?connectionKey=${instance}&value=enable`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Webhook V3 update response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function configureWebhook(instance: string, params: { webhookUrl: string }): Promise<Response> {
  console.log("Configuring webhook for instance:", instance);
  
  // Primeiro ativa o webhook V3
  await updateWebhookV3(instance);
  
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/webhook`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: params.webhookUrl,
      events: {
        qrCodeGenerated: true,
        qrCodeScanned: true,
        connectionStatus: true,
        messages: true
      },
      webhook_by_events: true,
      webhook_base64: true
    })
  });

  const data = await response.json();
  console.log("Webhook configuration response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function connectWhatsApp(instance: string): Promise<Response> {
  console.log("Connecting WhatsApp for instance:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/connect`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Connect response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function disconnectWhatsApp(instance: string): Promise<Response> {
  console.log("Disconnecting WhatsApp for instance:", instance);
  const response = await fetch(`${WHATSAPP_API_ENDPOINT}/api/instance/logout`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${instance}`,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("Disconnect response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function sendMessage(instance: string, params: any): Promise<Response> {
  const { phone, message } = params;
  console.log("Sending message for instance:", instance, "to phone:", phone);
  
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
  console.log("Send message response:", data);
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

serve(handleRequest);