import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";

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

interface FormValues {
  customer_name: string;
  customer_email: string;
  customer_document: string;
  amount: number;
  due_date: string;
}

export function EditChargeForm({ charge, onCancel }: EditChargeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    defaultValues: {
      customer_name: charge.customer_name,
      customer_email: charge.customer_email,
      customer_document: charge.customer_document,
      amount: charge.amount,
      due_date: format(new Date(charge.due_date), "yyyy-MM-dd"),
    },
  });

  const updateCharge = useMutation({
    mutationFn: async (values: FormValues) => {
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

  const onSubmit = (values: FormValues) => {
    updateCharge.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input {...field} type="number" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Form>
  );
}