import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function PaymentGatewayList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gateways de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mercado Pago */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mercado Pago</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard/settings/payment/mercadopago")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure suas credenciais do Mercado Pago para começar a receber pagamentos.
                </p>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Switch
                    checked={gateways?.find(g => g.gateway === "mercadopago")?.enabled || false}
                    onCheckedChange={(checked) => {
                      const gateway = gateways?.find(g => g.gateway === "mercadopago");
                      if (gateway) handleGatewayToggle(gateway.id, checked);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Asaas */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">ASAAS</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard/settings/payment/asaas")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure suas credenciais do ASAAS para começar a receber pagamentos.
                </p>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Switch
                    checked={gateways?.find(g => g.gateway === "asaas")?.enabled || false}
                    onCheckedChange={(checked) => {
                      const gateway = gateways?.find(g => g.gateway === "asaas");
                      if (gateway) handleGatewayToggle(gateway.id, checked);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* PagHiper */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">PagHiper</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard/settings/payment/paghiper")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure suas credenciais do PagHiper para começar a receber pagamentos.
                </p>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Switch
                    checked={gateways?.find(g => g.gateway === "paghiper")?.enabled || false}
                    onCheckedChange={(checked) => {
                      const gateway = gateways?.find(g => g.gateway === "paghiper");
                      if (gateway) handleGatewayToggle(gateway.id, checked);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gateway Principal</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}