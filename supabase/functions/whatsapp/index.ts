
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createInstance, getInstanceStatus, generateQRCode, disconnectInstance } from "./handlers/instance/index.ts";
import { sendMessage } from "./handlers/message.ts";

console.log("Hello from Whatsapp Edge Function!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Received request:", req.method, req.url);
    const { action, params } = await req.json();
    console.log(`Processando ação ${action} com params:`, params);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido');
    }

    const headers = {
      ...corsHeaders,
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    let response;
    switch (action) {
      case "createInstance":
        if (!params.companyId) throw new Error("companyId é obrigatório");
        response = await createInstance(headers, params.companyId);
        break;
      case "getInstanceStatus":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        response = await getInstanceStatus(headers, params.instanceKey);
        break;
      case "generateQRCode":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        response = await generateQRCode(headers, params.instanceKey);
        break;
      case "disconnectInstance":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        response = await disconnectInstance(headers, params.instanceKey);
        break;
      case "sendMessage":
        if (!params.phone || !params.message || !params.instanceKey) {
          throw new Error("phone, message e instanceKey são obrigatórios");
        }
        response = await sendMessage(headers, params);
        break;
      default:
        throw new Error("Ação inválida");
    }

    return response;
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message,
        error: error.stack
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});

