import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { useWhatsAppValidation } from "./validation/useWhatsAppValidation";
import { useCreateClient } from "./mutations/useCreateClient";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

export const useClientForm = (onClose: () => void) => {
  const { validateWhatsApp } = useWhatsAppValidation();
  const queryClient = useQueryClient();
  const { createClient, toast } = useCreateClient(onClose);

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
      birth_date: null,
    },
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      // Invalidar múltiplas queries relacionadas
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["clients-with-charges"] }),
        queryClient.invalidateQueries({ queryKey: ["charges"] }),
        queryClient.invalidateQueries({ queryKey: ["invoices"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      ]);
      
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