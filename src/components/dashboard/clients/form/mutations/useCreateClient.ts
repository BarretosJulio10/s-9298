
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { addDays, format } from 'date-fns';
import { getNextDueDateDays } from "@/lib/dateUtils";

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
      charge_frequency: values.charge_frequency,
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

    // Gerar fatura automática
    const uniqueChargeId = Math.floor(10000 + Math.random() * 90000).toString();

    // Usar a data de vencimento escolhida no cadastro
    const dueDate = values.birth_date;
    if (!dueDate) {
      console.error("Data de vencimento não fornecida");
      throw new Error("Data de vencimento é obrigatória");
    }

    // Calcula o número de dias baseado na frequência
    const daysToAdd = getNextDueDateDays(values.charge_frequency || 'monthly');
    
    // Adiciona os dias calculados à data escolhida e formata corretamente
    const adjustedDate = addDays(new Date(dueDate), daysToAdd);
    const adjustedDueDate = format(adjustedDate, 'yyyy-MM-dd');

    // Criar fatura na tabela invoices
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        company_id: user.id,
        client_id: client.id,
        amount: client.charge_amount,
        due_date: adjustedDueDate,
        status: 'pendente'
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Erro ao criar fatura:", invoiceError);
      toast({
        variant: "destructive",
        title: "Aviso",
        description: "Cliente cadastrado, mas houve um erro ao gerar a fatura.",
      });
    }

    // Criar registro na tabela client_charges
    const { error: clientChargeError } = await supabase
      .from("client_charges")
      .insert({
        client_id: client.id,
        amount: client.charge_amount,
        due_date: adjustedDueDate,
        status: "pending",
        payment_method: "pix"
      });

    if (clientChargeError) {
      console.error("Erro ao vincular cobrança ao cliente:", clientChargeError);
    }

    return client;
  };

  return { createClient, toast, queryClient };
};
