
import { supabase } from "@/integrations/supabase/client";

interface WAPIResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function callWhatsAppAPI(action: string, params?: any): Promise<WAPIResponse> {
  const { data: config, error } = await supabase
    .from("configurations")
    .select("wapi_token")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar configurações:", error);
    throw new Error("Erro ao buscar configurações do WhatsApp");
  }

  if (!config?.wapi_token) {
    throw new Error("Token da W-API não configurado. Configure-o na seção de configurações.");
  }

  try {
    const response = await fetch("/functions/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        token: config.wapi_token,
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
