import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export function PaymentGatewayList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gateways } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const gatewayMutation = useMutation({
    mutationFn: async ({ id, enabled, isDefault = false }: { id: string; enabled: boolean; isDefault?: boolean }) => {
      if (isDefault) {
        // Primeiro, remove o status de principal de todos os gateways
        const { error: resetError } = await supabase
          .from("payment_gateway_settings")
          .update({ is_default: false })
          .neq('id', id);

        if (resetError) throw resetError;
      }

      const { error } = await supabase
        .from("payment_gateway_settings")
        .update({ enabled, is_default: isDefault })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      toast({
        title: "Gateway atualizado",
        description: "O status do gateway foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o status do gateway.",
      });
    },
  });

  const handleGatewayToggle = (id: string, enabled: boolean) => {
    gatewayMutation.mutate({ id, enabled });
  };

  const handleDefaultGateway = (id: string) => {
    gatewayMutation.mutate({ id, enabled: true, isDefault: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gateways de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="mb-4">
            <Label className="text-base mb-2 block">Gateway Principal</Label>
            <RadioGroup 
              value={gateways?.find(g => g.is_default)?.id} 
              onValueChange={handleDefaultGateway}
              className="space-y-2"
            >
              {gateways?.map((gateway) => (
                <div key={gateway.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={gateway.id} id={`radio-${gateway.id}`} />
                  <Label htmlFor={`radio-${gateway.id}`}>
                    {gateway.gateway === "mercadopago"
                      ? "Mercado Pago"
                      : gateway.gateway === "asaas"
                      ? "ASAAS"
                      : gateway.gateway === "paghiper"
                      ? "PagHiper"
                      : gateway.gateway === "picpay"
                      ? "PicPay"
                      : "PagBank"}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base block">Status dos Gateways</Label>
            {gateways?.map((gateway) => (
              <div key={gateway.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    {gateway.gateway === "mercadopago"
                      ? "Mercado Pago"
                      : gateway.gateway === "asaas"
                      ? "ASAAS"
                      : gateway.gateway === "paghiper"
                      ? "PagHiper"
                      : gateway.gateway === "picpay"
                      ? "PicPay"
                      : "PagBank"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {gateway.environment === "sandbox" ? "Ambiente de Testes" : "Produção"}
                  </p>
                </div>
                <Switch
                  checked={gateway.enabled || false}
                  onCheckedChange={(checked) => handleGatewayToggle(gateway.id, checked)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}