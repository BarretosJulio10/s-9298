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

    console.log("Dados do cliente a serem enviados:", clientData);

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

    const { data: client, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir cliente:", error);
      throw new Error("Erro ao cadastrar cliente. Por favor, tente novamente.");
    }

    if (!client) {
      throw new Error("Erro ao cadastrar cliente: nenhum dado retornado");
    }

    // Gerar cobrança automática
    const uniqueChargeId = Math.floor(10000 + Math.random() * 90000).toString();

    // Usar a data de vencimento escolhida no cadastro
    const dueDate = values.birth_date;
    if (!dueDate) {
      console.error("Data de vencimento não fornecida");
      throw new Error("Data de vencimento é obrigatória");
    }

    const { data: charge, error: chargeError } = await supabase
      .from("charges")
      .insert({
        company_id: user.id,
        customer_name: client.name,
        customer_email: client.email,
        customer_document: client.document,
        amount: client.charge_amount,
        due_date: dueDate,
        status: "pending",
        payment_method: "pix",
        mercadopago_id: uniqueChargeId
      })
      .select()
      .single();

    if (chargeError) {
      console.error("Erro ao criar cobrança:", chargeError);
      // Não vamos lançar erro aqui para não impedir o cadastro do cliente
      toast({
        variant: "destructive",
        title: "Aviso",
        description: "Cliente cadastrado, mas houve um erro ao gerar a cobrança.",
      });
    }

    // Criar registro na tabela client_charges
    if (charge) {
      const { error: clientChargeError } = await supabase
        .from("client_charges")
        .insert({
          client_id: client.id,
          amount: client.charge_amount,
          due_date: dueDate,
          status: "pending",
          payment_method: "pix"
        });

      if (clientChargeError) {
        console.error("Erro ao vincular cobrança ao cliente:", clientChargeError);
      }
    }

    return client;
  };

  return { createClient, toast, queryClient };
};