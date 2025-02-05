import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { EditChargeFields } from "./edit-charge/EditChargeFields";
import { EditChargeActions } from "./edit-charge/EditChargeActions";
import { format } from "date-fns";
import { chargeSchema, type ChargeFormData } from "./schemas/chargeSchema";

interface EditChargeFormProps {
  charge: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_document: string;
    amount: number;
    due_date: string;
  };
  onCancel: () => void;
}

export function EditChargeForm({ charge, onCancel }: EditChargeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: {
      customer_name: charge.customer_name,
      customer_email: charge.customer_email,
      customer_document: charge.customer_document,
      amount: charge.amount,
      due_date: format(new Date(charge.due_date), "yyyy-MM-dd"),
    },
  });

  const updateCharge = useMutation({
    mutationFn: async (values: ChargeFormData) => {
      const { data: settings, error: settingsError } = await supabase
        .from("company_settings")
        .select("asaas_api_key, asaas_environment")
        .eq("company_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings?.asaas_api_key) {
        throw new Error("Chave API do Asaas não configurada");
      }

      // Primeiro atualiza no Asaas
      const asaasResponse = await fetch("/api/asaas/update-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: settings.asaas_api_key,
          environment: settings.asaas_environment,
          chargeId: charge.id,
          charge: {
            customer: {
              name: values.customer_name,
              email: values.customer_email,
              cpfCnpj: values.customer_document,
            },
            value: values.amount,
            dueDate: values.due_date,
          },
        }),
      });

      if (!asaasResponse.ok) {
        const error = await asaasResponse.json();
        throw new Error(error.message || "Erro ao atualizar cobrança no Asaas");
      }

      // Depois atualiza no banco
      const { error: updateError } = await supabase
        .from("charges")
        .update({
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_document: values.customer_document,
          amount: values.amount,
          due_date: values.due_date,
        })
        .eq("id", charge.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      toast({
        title: "Cobrança atualizada",
        description: "A cobrança foi atualizada com sucesso",
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cobrança",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: ChargeFormData) => {
    updateCharge.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EditChargeFields form={form} />
        <EditChargeActions 
          onCancel={onCancel} 
          isLoading={updateCharge.isPending} 
        />
      </form>
    </Form>
  );
}