
import { supabase } from "@/integrations/supabase/client";

export async function getAppropriateTemplate(
  parentTemplateId: string,
  dueDate: string,
  status: string,
  invoiceId: string
) {
  try {
    // Busca todos os templates filhos do template principal
    const { data: childTemplates, error: templatesError } = await supabase
      .from("message_templates")
      .select("*")
      .eq("parent_id", parentTemplateId);

    if (templatesError) throw templatesError;

    // Se não houver templates filhos, retorna o template principal
    if (!childTemplates || childTemplates.length === 0) {
      const { data: parentTemplate } = await supabase
        .from("message_templates")
        .select("*")
        .eq("id", parentTemplateId)
        .single();
      
      return parentTemplate;
    }

    // Verifica o status e a data de vencimento para selecionar o template apropriado
    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);

    if (status === "pago") {
      // Busca o template de pagamento
      const paymentTemplate = childTemplates.find(t => t.type === "paid");
      return paymentTemplate || null;
    } else if (dueDateTime < currentDate) {
      // Se vencido, busca o template de atraso
      const delayedTemplate = childTemplates.find(t => t.type === "delayed");
      return delayedTemplate || null;
    } else {
      // Se dentro do prazo, busca o template de notificação
      const notificationTemplate = childTemplates.find(t => t.type === "notification");
      return notificationTemplate || null;
    }
  } catch (error) {
    console.error("Erro ao selecionar template:", error);
    return null;
  }
}
