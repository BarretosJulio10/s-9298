
interface WAPIResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export async function callWhatsAppAPI(action: string, params?: any): Promise<WAPIResponse> {
  try {
    console.log(`Chamando API do WhatsApp - Ação: ${action}`, params);

    const response = await fetch(`/functions/whatsapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        params
      })
    });

    const responseText = await response.text();
    console.log("Resposta da API (texto):", responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Erro ao fazer parse da resposta:", e);
      throw new Error("Resposta inválida da API");
    }

    if (!response.ok) {
      console.error("Erro na resposta da API:", data);
      throw new Error(data.error || data.message || "Erro ao enviar mensagem");
    }

    return {
      success: true,
      data: data
    };
  } catch (error: any) {
    console.error("Erro na chamada da API do WhatsApp:", error);
    return {
      success: false,
      error: error.message || "Erro ao se comunicar com o serviço do WhatsApp"
    };
  }
}
