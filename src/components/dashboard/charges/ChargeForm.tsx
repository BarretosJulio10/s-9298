import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChargeFormData {
  customer_name: string;
  customer_email: string;
  customer_document: string;
  amount: string;
  due_date: string;
  gateway_id: string;
}

export function ChargeForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const form = useForm<ChargeFormData>();
  const [isLoading, setIsLoading] = useState(false);

  // Busca os gateways disponíveis e o gateway padrão
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

  // Busca o gateway padrão
  const defaultGateway = gateways?.find(g => g.is_default);

  const onSubmit = async (data: ChargeFormData) => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    try {
      // Primeiro, cria a cobrança no banco
      const { data: charge, error: chargeError } = await supabase
        .from("charges")
        .insert({
          company_id: session.user.id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_document: data.customer_document,
          amount: parseFloat(data.amount),
          due_date: data.due_date,
          gateway_id: data.gateway_id || defaultGateway?.id,
          status: "pending"
        })
        .select()
        .single();

      if (chargeError) throw chargeError;

      // Agora vamos gerar o link de pagamento baseado no gateway selecionado
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
              customer_document: data.customer_document,
              amount: parseFloat(data.amount),
              due_date: data.due_date,
              payment_method: "pix"
            },
            company_id: session.user.id
          }),
        });

        const mpResponse = await response.json();
        
        if (!response.ok) throw new Error(mpResponse.error);

        // Atualiza a cobrança com o link de pagamento
        const { error: updateError } = await supabase
          .from("charges")
          .update({ 
            payment_link: mpResponse.payment_link,
            status: mpResponse.status 
          })
          .eq("id", charge.id);

        if (updateError) throw updateError;

        toast({
          title: "Link de pagamento gerado",
          description: "O link foi gerado e a cobrança foi criada com sucesso",
        });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Cobrança</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Cliente</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gateway_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gateway" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gateways?.map((gateway) => (
                        <SelectItem key={gateway.id} value={gateway.id}>
                          {gateway.gateway === "mercadopago"
                            ? "Mercado Pago"
                            : gateway.gateway === "asaas"
                            ? "ASAAS"
                            : gateway.gateway === "paghiper"
                            ? "PagHiper"
                            : gateway.gateway === "picpay"
                            ? "PicPay"
                            : "PagBank"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gerando link..." : "Gerar Link de Pagamento"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}