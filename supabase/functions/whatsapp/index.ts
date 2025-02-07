
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createInstance, getInstanceStatus, generateQRCode, disconnectInstance } from "./handlers/instance/index.ts";
import { sendMessage } from "./handlers/message.ts";

console.log("Hello from Whatsapp Edge Function!")

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    console.log(`Processando ação ${action} com params:`, params);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido');
    }

    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    switch (action) {
      case "createInstance":
        if (!params.companyId) throw new Error("companyId é obrigatório");
        return await createInstance(headers, params.companyId);
      case "getInstanceStatus":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        return await getInstanceStatus(headers, params.instanceKey);
      case "generateQRCode":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        return await generateQRCode(headers, params.instanceKey);
      case "disconnectInstance":
        if (!params.instanceKey) throw new Error("instanceKey é obrigatório");
        return await disconnectInstance(headers, params.instanceKey);
      case "sendMessage":
        if (!params.phone || !params.message || !params.instanceKey) {
          throw new Error("phone, message e instanceKey são obrigatórios");
        }
        return await sendMessage(headers, params);
      default:
        return new Response(
          JSON.stringify({ success: false, message: "Ação inválida" }),
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
