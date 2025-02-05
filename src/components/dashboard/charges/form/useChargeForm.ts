import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ChargeFormData {
  customer_name: string;
  customer_email: string;
  customer_document: string;
  amount: string;
  due_date: string;
  gateway_id: string;
}

export function useChargeForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const form = useForm<ChargeFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: gateways } = useQuery({
    queryKey: ["payment-gateways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .eq("enabled", true)
        .eq("company_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
  });

  const defaultGateway = gateways?.find(g => g.is_default);

  const generateUniqueId = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const onSubmit = async (data: ChargeFormData) => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    try {
      const uniqueChargeId = generateUniqueId();
      
      const { data: charge, error: chargeError } = await supabase
        .from("charges")
        .insert({
          company_id: session.user.id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_document: data.customer_document.replace(/\D/g, ''),
          amount: parseFloat(data.amount),
          due_date: data.due_date,
          gateway_id: data.gateway_id || defaultGateway?.id,
          status: "pending",
          payment_method: "pix",
          mercadopago_id: uniqueChargeId
        })
        .select()
        .single();

      if (chargeError) throw chargeError;

      console.log("Charge created:", charge);

      const selectedGateway = gateways?.find(g => g.id === (data.gateway_id || defaultGateway?.id));
      
      if (selectedGateway?.gateway === "mercadopago") {
        const response = await fetch("/api/functions/v1/mercadopago", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create_charge",
            charge: {
              customer_name: data.customer_name,
              customer_email: data.customer_email,
              customer_document: data.customer_document.replace(/\D/g, ''),
              amount: parseFloat(data.amount),
              due_date: data.due_date,
              payment_method: "pix",
              charge_id: uniqueChargeId
            },
            company_id: session.user.id
          }),
        });

        const mpResponse = await response.json();
        console.log("Mercado Pago response:", mpResponse);
        
        if (!response.ok) throw new Error(mpResponse.error);

        const { error: updateError } = await supabase
          .from("charges")
          .update({ 
            payment_link: mpResponse.payment_link,
            status: mpResponse.status 
          })
          .eq("id", charge.id);

        if (updateError) throw updateError;

        if (mpResponse.payment_link) {
          await navigator.clipboard.writeText(mpResponse.payment_link);
          toast({
            title: "Link de pagamento gerado",
            description: "O link foi copiado para sua área de transferência",
          });
        }
      }

      form.reset();
    } catch (error: any) {
      console.error("Erro ao criar cobrança:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    gateways,
    isLoading,
    onSubmit
  };
}