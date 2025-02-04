import { QrCode, CreditCard, Barcode } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodSection } from "./PaymentMethodSection";

export function PaymentSettings() {
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
    mutationFn: async ({ id, isDefault = true }: { id: string; isDefault: boolean }) => {
      // Primeiro, remove o status de principal de todos os gateways
      const { error: resetError } = await supabase
        .from("payment_gateway_settings")
        .update({ is_default: false })
        .neq('id', id);

      if (resetError) throw resetError;

      const { error } = await supabase
        .from("payment_gateway_settings")
        .update({ is_default: isDefault, enabled: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      toast({
        title: "Gateway atualizado",
        description: "O gateway principal foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o gateway.",
      });
    },
  });

  const handleGatewaySelect = (id: string) => {
    gatewayMutation.mutate({ id, isDefault: true });
  };

  const pixGateways = gateways?.filter(g => g.enabled) || [];
  const cardGateways = gateways?.filter(g => g.enabled) || [];
  const boletoGateways = gateways?.filter(g => g.enabled) || [];

  return (
    <div className="space-y-6">
      <PaymentMethodSection
        title="Pagamentos com PIX"
        icon={<QrCode className="h-5 w-5" />}
        gateways={pixGateways}
        method="pix"
        onSelect={handleGatewaySelect}
      />
      
      <PaymentMethodSection
        title="Pagamentos com Cartão"
        icon={<CreditCard className="h-5 w-5" />}
        gateways={cardGateways}
        method="credit_card"
        onSelect={handleGatewaySelect}
      />
      
      <PaymentMethodSection
        title="Pagamentos com Boleto"
        icon={<Barcode className="h-5 w-5" />}
        gateways={boletoGateways}
        method="boleto"
        onSelect={handleGatewaySelect}
      />
    </div>
  );
}