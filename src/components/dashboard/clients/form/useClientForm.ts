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
      birth_date: undefined,
      charge_amount: 0,
      payment_methods: ['pix'],
      charge_type: 'recurring',
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Client) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Check if client with same email already exists
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("email", values.email)
        .eq("company_id", user.id)
        .single();

      if (existingClient) {
        throw new Error("Já existe um cliente cadastrado com este email");
      }

      const { data, error } = await supabase
        .from("clients")
        .insert([{
          ...values,
          company_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente cadastrado com sucesso!",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    },
  });

  return {
    form,
    mutation,
    validateWhatsApp,
  };
};