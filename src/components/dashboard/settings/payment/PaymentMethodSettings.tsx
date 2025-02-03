import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PaymentGateway {
  id: string;
  gateway: "mercadopago" | "asaas" | "paghiper" | "picpay" | "pagbank";
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  gateway_id: string;
  method: "pix" | "credit_card" | "boleto";
  enabled: boolean;
}

export function PaymentMethodSettings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadSettings = async () => {
      try {
        const { data: gatewaysData, error: gatewaysError } = await supabase
          .from("payment_gateway_settings")
          .select("*")
          .eq("company_id", session.user.id);

        if (gatewaysError) throw gatewaysError;

        const { data: methodsData, error: methodsError } = await supabase
          .from("payment_method_settings")
          .select("*")
          .eq("company_id", session.user.id);

        if (methodsError) throw methodsError;

        setGateways(gatewaysData);
        setMethods(methodsData);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar configurações",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [session?.user?.id, toast]);

  const toggleMethod = async (
    gatewayId: string,
    method: "pix" | "credit_card" | "boleto",
    enabled: boolean
  ) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase.from("payment_method_settings").upsert({
        company_id: session.user.id,
        gateway_id: gatewayId,
        method,
        enabled,
      });

      if (error) throw error;

      setMethods((prev) =>
        prev.map((m) =>
          m.gateway_id === gatewayId && m.method === method
            ? { ...m, enabled }
            : m
        )
      );

      toast({
        title: "Configuração atualizada",
        description: "O método de pagamento foi atualizado com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {gateways.map((gateway) => (
            <div key={gateway.id} className="space-y-4">
              <h3 className="font-medium">
                {gateway.gateway === "mercadopago"
                  ? "Mercado Pago"
                  : gateway.gateway === "asaas"
                  ? "ASAAS"
                  : gateway.gateway === "paghiper"
                  ? "PagHiper"
                  : gateway.gateway === "picpay"
                  ? "PicPay"
                  : "PagBank"}
              </h3>
              <div className="grid gap-4">
                {["pix", "credit_card", "boleto"].map((method) => {
                  const methodSetting = methods.find(
                    (m) =>
                      m.gateway_id === gateway.id &&
                      m.method === method
                  );
                  return (
                    <div
                      key={`${gateway.id}-${method}`}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <Label className="text-base">
                        {method === "pix"
                          ? "PIX"
                          : method === "credit_card"
                          ? "Cartão de Crédito"
                          : "Boleto"}
                      </Label>
                      <Switch
                        checked={methodSetting?.enabled ?? false}
                        onCheckedChange={(checked) =>
                          toggleMethod(
                            gateway.id,
                            method as "pix" | "credit_card" | "boleto",
                            checked
                          )
                        }
                        disabled={!gateway.enabled}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}