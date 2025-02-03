import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface NotificationRule {
  id: string;
  company_id: string;
  days_before: number;
  days_after: number;
  template_id: string;
  active: boolean;
}

interface MessageTemplate {
  id: string;
  content: string;
}

async function processNotifications() {
  console.log("Starting notification processing...");

  // Buscar todas as regras ativas
  const { data: rules, error: rulesError } = await supabase
    .from("notification_rules")
    .select(`
      *,
      message_templates (
        id,
        content
      )
    `)
    .eq("active", true);

  if (rulesError) {
    console.error("Error fetching rules:", rulesError);
    throw rulesError;
  }

  // Para cada regra, buscar cobranças relevantes
  for (const rule of rules) {
    console.log(`Processing rule ${rule.id} for company ${rule.company_id}`);

    const today = new Date();
    const { data: charges, error: chargesError } = await supabase
      .from("charges")
      .select("*")
      .eq("company_id", rule.company_id)
      .eq("notification_sent", false)
      .in("status", ["pending", "overdue"]);

    if (chargesError) {
      console.error("Error fetching charges:", chargesError);
      continue;
    }

    for (const charge of charges) {
      const dueDate = new Date(charge.due_date);
      const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Verificar se a cobrança se enquadra nas regras de notificação
      if (
        (daysDiff === rule.days_before) || // Notificação antes do vencimento
        (daysDiff === -rule.days_after && charge.status === "overdue") // Notificação após o vencimento
      ) {
        console.log(`Sending notification for charge ${charge.id}`);

        try {
          // Enviar notificação via WhatsApp
          const response = await fetch(`${supabaseUrl}/functions/v1/whatsapp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              action: "sendMessage",
              params: {
                phone: charge.customer_phone,
                message: rule.message_templates.content
                  .replace("{nome}", charge.customer_name)
                  .replace("{valor}", new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }).format(charge.amount))
                  .replace("{vencimento}", new Date(charge.due_date).toLocaleDateString("pt-BR"))
                  .replace("{link}", charge.payment_link || ""),
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`WhatsApp API error: ${response.statusText}`);
          }

          // Registrar o envio da notificação
          const { error: historyError } = await supabase
            .from("notification_history")
            .insert({
              charge_id: charge.id,
              type: daysDiff > 0 ? "reminder" : "overdue",
              status: "sent",
              message: rule.message_templates.content,
            });

          if (historyError) {
            console.error("Error recording notification history:", historyError);
          }

          // Atualizar o status de notificação da cobrança
          const { error: updateError } = await supabase
            .from("charges")
            .update({
              notification_sent: true,
              notification_date: new Date().toISOString(),
            })
            .eq("id", charge.id);

          if (updateError) {
            console.error("Error updating charge notification status:", updateError);
          }

        } catch (error) {
          console.error("Error processing notification:", error);
          
          // Registrar falha no histórico
          await supabase
            .from("notification_history")
            .insert({
              charge_id: charge.id,
              type: daysDiff > 0 ? "reminder" : "overdue",
              status: "failed",
              message: error.message,
            });
        }
      }
    }
  }

  console.log("Notification processing completed");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    await processNotifications();
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in process-notifications function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});