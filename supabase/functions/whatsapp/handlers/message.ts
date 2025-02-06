
import { WAPI_ENDPOINT } from "../config.ts";
import { corsHeaders } from "../../_shared/cors.ts";

export async function sendMessage(headers: HeadersInit, params: any): Promise<Response> {
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

