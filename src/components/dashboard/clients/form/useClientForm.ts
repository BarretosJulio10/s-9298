import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { useWhatsAppValidation } from "./validation/useWhatsAppValidation";
import { useCreateClient } from "./mutations/useCreateClient";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

export const useClientForm = (onClose: () => void) => {
  const { validateWhatsApp } = useWhatsAppValidation();
  const { createClient, toast, queryClient } = useCreateClient(onClose);

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