import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

export const useClientForm = (onClose: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateWhatsApp = async (phone: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) return false;
    if (cleanPhone[2] !== '9') return false;
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    return true;
  };

  const form = useForm<Client>({
    defaultValues: {
      name: "",
      email: "",
      document: "",
      phone: "",
      status: "active",
      charge_amount: 0,
      payment_methods: ['pix'],
      charge_type: 'recurring',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Client) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Usuário não autenticado");
        }

        // Garante que charge_amount é um número
        const charge_amount = typeof values.charge_amount === 'string' 
          ? parseFloat(values.charge_amount) 
          : values.charge_amount;

        console.log("Dados a serem enviados:", { 
          ...values, 
          company_id: user.id,
          charge_amount 
        });

        // Verifica se já existe cliente com mesmo email
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

        // Insere o novo cliente
        const { data, error } = await supabase
          .from("clients")
          .insert([{
            ...values,
            company_id: user.id,
            charge_amount: charge_amount || 0, // Garante que sempre temos um número válido
          }])
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
      } catch (error: any) {
        console.error("Erro ao cadastrar cliente:", error);
        throw new Error(error.message || "Erro ao cadastrar cliente. Tente novamente mais tarde.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente cadastrado com sucesso!",
      });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.message,
      });
    },
  });

  return {
    form,
    mutation,
    validateWhatsApp,
  };
};