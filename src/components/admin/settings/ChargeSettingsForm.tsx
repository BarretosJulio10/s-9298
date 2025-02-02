import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChargeSettingsFormData {
  default_interest_rate: number;
  default_late_fee: number;
  auto_send_notifications: boolean;
  notification_days_before: number;
  notification_message: string;
}

export function ChargeSettingsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ChargeSettingsFormData>({
    defaultValues: {
      default_interest_rate: 0.033,
      default_late_fee: 2.0,
      auto_send_notifications: true,
      notification_days_before: 2,
      notification_message: "",
    },
  });

  // Buscar usuário atual
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  // Buscar configurações existentes
  const { data: settings } = useQuery({
    queryKey: ["charge-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charge_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Mutation para salvar configurações
  const mutation = useMutation({
    mutationFn: async (values: ChargeSettingsFormData) => {
      if (!user?.id) throw new Error("Usuário não encontrado");

      const { error } = await supabase
        .from("charge_settings")
        .upsert([{ ...values, company_id: user.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charge-settings"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações de cobrança foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações de cobrança.",
      });
    },
  });

  const onSubmit = (data: ChargeSettingsFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Cobrança</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="default_interest_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Juros Padrão (% ao dia)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.033"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_late_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Multa Padrão (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="2.0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}