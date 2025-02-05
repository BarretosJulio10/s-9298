import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

export const useCreateClient = (onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createClient = async (values: Client) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const charge_amount = typeof values.charge_amount === 'string' 
      ? parseFloat(values.charge_amount) 
      : values.charge_amount;

    const clientData = {
      name: values.name,
      email: values.email,
      document: values.document,
      phone: values.phone,
      status: values.status,
      charge_amount,
      payment_methods: values.payment_methods,
      charge_type: values.charge_type,
      birth_date: values.birth_date,
      company_id: user.id,
    };

    console.log("Dados a serem enviados:", clientData);

    const { data: existingClients, error: checkError } = await supabase
      .from("clients")
      .select("id")
      .eq("email", values.email)
      .eq("company_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar email:", checkError);
      throw new Error("Erro ao verificar email do cliente");
    }

    if (existingClients) {
      throw new Error("Já existe um cliente cadastrado com este email");
    }

    const { data, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Erro ao inserir cliente:", error);
      throw new Error("Erro ao cadastrar cliente. Por favor, tente novamente.");
    }

    if (!data) {
      throw new Error("Erro ao cadastrar cliente: nenhum dado retornado");
    }

    return data;
  };

  return { createClient, toast, queryClient };
};