
import { WAPI_ENDPOINT } from "../config.ts";
import { corsHeaders } from "../../_shared/cors.ts";

export async function sendMessage(headers: HeadersInit, params: any): Promise<Response> {
  const { phone, message } = params;
  
  try {
    console.log("Enviando mensagem para:", phone);
    console.log("Conteúdo da mensagem:", message);

    const body = {
      number: phone.replace(/\D/g, ''), // Remove caracteres não numéricos
      text: message,
      channelId: "WHATSAPP" // Especifica o canal como WhatsApp
    };

    console.log("Corpo da requisição:", JSON.stringify(body));

    const response = await fetch(`${WAPI_ENDPOINT}/messages/text`, {
      method: "POST",
      headers: {
        ...headers,
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na resposta da API:", errorText);
      throw new Error(`Erro ao enviar mensagem: ${response.status} - ${errorText}`);
    }

    let data;
    const responseText = await response.text();
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.warn("Resposta não é JSON válido:", responseText);
      data = { success: true, message: "Mensagem enviada" };
    }

    console.log("Mensagem enviada com sucesso:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido ao enviar mensagem" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
