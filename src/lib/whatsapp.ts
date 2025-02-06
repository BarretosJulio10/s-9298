
interface WAPIResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function callWhatsAppAPI(action: string, params?: any): Promise<WAPIResponse> {
  try {
    const response = await fetch("/functions/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        params
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro na resposta da API:", error);
      throw new Error(error.message || "Erro ao enviar mensagem");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Erro na chamada da API do WhatsApp:", error);
    throw new Error(error.message || "Erro ao se comunicar com o serviço do WhatsApp");
  }
}
