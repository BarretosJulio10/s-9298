import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useClients() {
  return useQuery({
    queryKey: ["clients-with-charges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select(`
          *,
          client_charges (
            status,
            due_date,
            payment_link
          )
        `)
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (clientsError) {
        console.error("Erro ao buscar clientes:", clientsError);
        throw clientsError;
      }

      console.log("Clients data:", clients); // Debug log

      return clients.map(client => {
        const paymentLink = getLatestPaymentLink(client.client_charges);
        console.log(`Client ${client.name} payment link:`, paymentLink); // Debug log
        
        return {
          ...client,
          paymentStatus: getPaymentStatus(client.client_charges),
          paymentLink: paymentLink
        };
      });
    }
  });
}

function getPaymentStatus(charges: any[]) {
  if (!charges || charges.length === 0) return "pending";
  
  const latestCharge = charges[0];
  if (!latestCharge) return "pending";

  if (latestCharge.status === "paid") return "paid";
  
  const dueDate = new Date(latestCharge.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Remove o horário para comparar apenas as datas
  
  if (dueDate < today) return "overdue";
  return "pending";
}

function getLatestPaymentLink(charges: any[]) {
  if (!charges || charges.length === 0) return null;
  const latestCharge = charges[0];
  console.log("Latest charge:", latestCharge); // Debug log
  return latestCharge?.payment_link || null;
}