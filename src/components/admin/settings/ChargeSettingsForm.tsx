import * as React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChargeSettingsFormData {
  default_interest_rate?: number;
  default_late_fee?: number;
  auto_send_notifications?: boolean;
  notification_days_before?: number;
  notification_message?: string;
}

export function ChargeSettingsForm() {
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<ChargeSettingsFormData>({
    defaultValues: {
      default_interest_rate: 0.033,
      default_late_fee: 2.0,
      auto_send_notifications: true,
      notification_days_before: 2,
      notification_message: "Olá! Sua fatura vence em {dias_antes} dias. Acesse o link para pagamento: {link}",
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

  // Atualizar formulário quando as configurações forem carregadas
  React.useEffect(() => {
    if (settings) {
      Object.entries(settings).forEach(([key, value]) => {
        if (key in settings) {
          setValue(key as keyof ChargeSettingsFormData, value as any);
        }
      });
    }
  }, [settings, setValue]);

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
      toast({
        title: "Configurações salvas",
        description: "As configurações de cobrança foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar configurações",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as configurações",
      });
    },
  });

  const autoSendNotifications = watch("auto_send_notifications");

  const onSubmit = (data: ChargeSettingsFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Cobrança</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="default_interest_rate">Taxa de Juros Padrão (%)</label>
            <Input
              id="default_interest_rate"
              type="number"
              step="0.001"
              {...register("default_interest_rate")}
            />
            <p className="text-sm text-muted-foreground">
              Taxa de juros diária aplicada em cobranças atrasadas
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="default_late_fee">Multa Padrão (%)</label>
            <Input
              id="default_late_fee"
              type="number"
              step="0.01"
              {...register("default_late_fee")}
            />
            <p className="text-sm text-muted-foreground">
              Multa aplicada em cobranças atrasadas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto_send_notifications"
              {...register("auto_send_notifications")}
            />
            <label htmlFor="auto_send_notifications">
              Enviar notificações automaticamente
            </label>
          </div>

          {autoSendNotifications && (
            <>
              <div className="space-y-2">
                <label htmlFor="notification_days_before">
                  Dias antes do vencimento
                </label>
                <Input
                  id="notification_days_before"
                  type="number"
                  {...register("notification_days_before")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notification_message">
                  Mensagem de notificação
                </label>
                <Textarea
                  id="notification_message"
                  {...register("notification_message")}
                />
                <p className="text-sm text-muted-foreground">
                  Use {"{dias_antes}"} para incluir os dias antes do vencimento e{" "}
                  {"{link}"} para incluir o link de pagamento
                </p>
              </div>
            </>
          )}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}