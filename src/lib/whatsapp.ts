import { supabase } from "@/integrations/supabase/client";

export async function callWhatsAppAPI(action: string, params?: any) {
  const { data: config, error } = await supabase
    .from("configurations")
    .select("whatsapp_instance_id")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar configurações:", error);
    throw new Error("Erro ao buscar configurações do WhatsApp");
  }

  if (!config?.whatsapp_instance_id) {
    throw new Error("WhatsApp instance ID não configurado. Configure-o na seção de configurações.");
  }

  try {
    const response = await fetch("/functions/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        instance: config.whatsapp_instance_id,
        params
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Erro na resposta da API:", error);
      throw new Error(error.message || "Erro ao enviar mensagem");
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error("Erro nos dados da API:", data);
      throw new Error(data.message || "Erro ao processar requisição do WhatsApp");
    }

    return data;
  } catch (error: any) {
    console.error("Erro na chamada da API do WhatsApp:", error);
    throw new Error(error.message || "Erro ao se comunicar com o serviço do WhatsApp");
  }
}