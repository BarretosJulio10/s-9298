
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "../types/Invoice";
import { useToast } from "@/hooks/use-toast";

export function useInvoices() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      console.log("Buscando faturas para o usuário:", user.id);

      // Primeiro, vamos verificar se existem faturas
      const { count, error: countError } = await supabase
        .from("invoices")
        .select("*", { count: 'exact', head: true })
        .eq('company_id', user.id);

      if (countError) {
        console.error("Erro ao contar faturas:", countError);
        throw countError;
      }

      console.log("Total de faturas encontradas:", count);

      // Busca os dados completos
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients (
            name,
            email,
            document,
            phone
          )
        `)
        .eq('company_id', user.id);

      if (error) {
        console.error("Erro ao buscar faturas:", error);
        console.error("Detalhes do erro:", {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("Faturas encontradas:", data);
      
      if (data) {
        data.forEach((invoice, index) => {
          console.log(`Fatura ${index + 1}:`, {
            id: invoice.id,
            amount: invoice.amount,
            status: invoice.status,
            client: invoice.client
          });
        });
      }

      return data as Invoice[];
    },
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar faturas",
          description: "Detalhes: " + error.message,
        });
      }
    }
  });
}
