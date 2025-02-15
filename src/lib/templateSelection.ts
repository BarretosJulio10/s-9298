
import { supabase } from "@/integrations/supabase/client";

export async function getAppropriateTemplate(
  templateType: string,
  dueDate: string,
  status: string,
  invoiceId: string
) {
  try {
    // Primeiro obter o company_id do usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // 1. Primeiro buscar o template pai pelo tipo e company_id
    const { data: parentTemplate, error: parentError } = await supabase
      .from("message_templates")
      .select("*")
      .eq("type", templateType)
      .eq("company_id", user.id)
      .is("parent_id", null)
      .maybeSingle();

    if (parentError) throw parentError;
    if (!parentTemplate) {
      console.error('Template pai não encontrado para o tipo:', templateType);
      return null;
    }

    // 2. Buscar templates filhos usando o ID do template pai e company_id
    const { data: childTemplates, error: templatesError } = await supabase
      .from("message_templates")
      .select("*")
      .eq("parent_id", parentTemplate.id)
      .eq("company_id", user.id);

    if (templatesError) throw templatesError;

    // Se não houver templates filhos, retorna o template principal
    if (!childTemplates || childTemplates.length === 0) {
      return parentTemplate;
    }

    // Verifica o status e a data de vencimento para selecionar o template apropriado
    const currentDate = new Date();
    const dueDateTime = new Date(dueDate);

    if (status === "pago") {
      // Busca o template de pagamento
      const paymentTemplate = childTemplates.find(t => t.subtype === "paid");
      return paymentTemplate || parentTemplate;
    } else if (dueDateTime < currentDate) {
      // Se vencido, busca o template de atraso
      const delayedTemplate = childTemplates.find(t => t.subtype === "delayed");
      return delayedTemplate || parentTemplate;
    } else {
      // Se dentro do prazo, busca o template de notificação
      const notificationTemplate = childTemplates.find(t => t.subtype === "notification");
      return notificationTemplate || parentTemplate;
    }
  } catch (error) {
    console.error("Erro ao selecionar template:", error);
    return null;
  }
}
