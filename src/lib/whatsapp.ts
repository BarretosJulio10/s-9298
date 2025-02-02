import { supabase } from "@/integrations/supabase/client";

export async function callWhatsAppAPI(action: string, params?: any) {
  const { data: config } = await supabase
    .from("configurations")
    .select("whatsapp_instance_id")
    .single();

  if (!config?.whatsapp_instance_id) {
    throw new Error("WhatsApp instance ID not configured");
  }

  const response = await fetch("/functions/v1/whatsapp", {
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
    throw new Error("Failed to call WhatsApp API");
  }

  return response.json();
}