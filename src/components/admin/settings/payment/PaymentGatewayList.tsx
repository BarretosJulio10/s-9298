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
import { useAuth } from "@/hooks/useAuth";

export function PaymentGatewayList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: gateways } = useQuery({
    queryKey: ["payment-gateways", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .eq("company_id", session.user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
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
            <Card className="border-2 hover:border-primary transition-colors">
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
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={gateways?.find(g => g.gateway === "mercadopago")?.id || ""} 
                      id="mercadopago"
                      checked={gateways?.find(g => g.gateway === "mercadopago")?.is_default || false}
                      onClick={() => {
                        const gateway = gateways?.find(g => g.gateway === "mercadopago");
                        if (gateway) handleDefaultGateway(gateway.id);
                      }}
                    />
                    <Label htmlFor="mercadopago">Gateway Principal</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ASAAS */}
            <Card className="border-2 hover:border-primary transition-colors">
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
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={gateways?.find(g => g.gateway === "asaas")?.id || ""} 
                      id="asaas"
                      checked={gateways?.find(g => g.gateway === "asaas")?.is_default || false}
                      onClick={() => {
                        const gateway = gateways?.find(g => g.gateway === "asaas");
                        if (gateway) handleDefaultGateway(gateway.id);
                      }}
                    />
                    <Label htmlFor="asaas">Gateway Principal</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PagHiper */}
            <Card className="border-2 hover:border-primary transition-colors">
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
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={gateways?.find(g => g.gateway === "paghiper")?.id || ""} 
                      id="paghiper"
                      checked={gateways?.find(g => g.gateway === "paghiper")?.is_default || false}
                      onClick={() => {
                        const gateway = gateways?.find(g => g.gateway === "paghiper");
                        if (gateway) handleDefaultGateway(gateway.id);
                      }}
                    />
                    <Label htmlFor="paghiper">Gateway Principal</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}