import { supabase } from "@/integrations/supabase/client";

export async function callWhatsAppAPI(action: string, params?: any) {
  const { data: config } = await supabase
    .from("configurations")
    .select("whatsapp_instance_id")
    .single();

  if (!config?.whatsapp_instance_id) {
    throw new Error("WhatsApp instance ID não configurado");
  }

  const response = await fetch("/api/whatsapp", {
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
    throw new Error(error.message || "Erro ao enviar mensagem");
  }

  return response.json();
}