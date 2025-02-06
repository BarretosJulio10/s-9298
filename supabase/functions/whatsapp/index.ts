
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { headers as defaultHeaders } from "./config.ts";
import { createInstance, getInstanceStatus, generateQRCode } from "./handlers/instance.ts";
import { sendMessage } from "./handlers/message.ts";

async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    console.log(`Processando ação ${action} com params:`, params);

    const headers = {
      ...defaultHeaders,
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

serve(handleRequest);

