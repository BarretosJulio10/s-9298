import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from("payment_gateway_settings")
        .update({ enabled })
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gateways de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
      </CardContent>
    </Card>
  );
}