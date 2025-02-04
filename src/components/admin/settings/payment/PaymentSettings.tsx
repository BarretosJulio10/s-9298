import { CreditCard, QrCode, Barcode } from "lucide-react";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function PaymentSettings() {
  const { session } = useAuth();

  const { data: gateways } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .eq("company_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
  });

  const handleGatewaySelect = (gatewayId: string) => {
    // Implementar lógica de seleção se necessário
  };

  return (
    <div className="space-y-6">
      <PaymentMethodSection
        title="PIX"
        icon={<QrCode className="h-4 w-4" />}
        gateways={gateways?.filter(g => ["mercadopago", "asaas", "paghiper"].includes(g.gateway)) || []}
        method="pix"
        onSelect={handleGatewaySelect}
      />

      <PaymentMethodSection
        title="Cartão de Crédito"
        icon={<CreditCard className="h-4 w-4" />}
        gateways={gateways?.filter(g => ["mercadopago", "asaas"].includes(g.gateway)) || []}
        method="credit_card"
        onSelect={handleGatewaySelect}
      />

      <PaymentMethodSection
        title="Boleto"
        icon={<Barcode className="h-4 w-4" />}
        gateways={gateways?.filter(g => ["asaas", "paghiper"].includes(g.gateway)) || []}
        method="boleto"
        onSelect={handleGatewaySelect}
      />
    </div>
  );
}
