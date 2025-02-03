import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface ChargeFormData {
  customer_name: string;
  customer_email: string;
  customer_document: string;
  amount: number;
  due_date: string;
  payment_method: "pix" | "boleto" | "credit_card";
}

interface PaymentGateway {
  id: string;
  gateway: string;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  gateway_id: string;
  method: string;
  enabled: boolean;
}

export function ChargeForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<ChargeFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadPaymentMethods = async () => {
      try {
        const { data: methods, error } = await supabase
          .from("payment_method_settings")
          .select(`
            id,
            gateway_id,
            method,
            enabled,
            payment_gateway_settings!inner(
              id,
              gateway,
              enabled
            )
          `)
          .eq("company_id", session.user.id)
          .eq("enabled", true)
          .eq("payment_gateway_settings.enabled", true);

        if (error) throw error;
        setAvailableMethods(methods || []);
      } catch (error: any) {
        console.error("Error loading payment methods:", error);
      }
    };

    loadPaymentMethods();
  }, [session?.user?.id]);

  const createCharge = useMutation({
    mutationFn: async (data: ChargeFormData) => {
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { data: settings, error: settingsError } = await supabase
        .from("company_settings")
        .select("*")
        .eq("company_id", session.user.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings?.asaas_api_key) {
        throw new Error("Chave API do Asaas não configurada");
      }

      const asaasResponse = await fetch("/api/asaas/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: settings.asaas_api_key,
          environment: settings.asaas_environment,
          charge: {
            customer: {
              name: data.customer_name,
              email: data.customer_email,
              cpfCnpj: data.customer_document,
            },
            billingType: data.payment_method.toUpperCase(),
            value: data.amount,
            dueDate: data.due_date,
          },
        }),
      });

      if (!asaasResponse.ok) {
        const error = await asaasResponse.json();
        throw new Error(error.message || "Erro ao criar cobrança no Asaas");
      }

      const asaasData = await asaasResponse.json();

      const { error: chargeError } = await supabase.from("charges").insert({
        company_id: session.user.id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_document: data.customer_document,
        amount: data.amount,
        due_date: data.due_date,
        payment_method: data.payment_method,
        asaas_id: asaasData.id,
        payment_link: asaasData.bankSlipUrl || asaasData.invoiceUrl,
        status: "pending",
      });

      if (chargeError) throw chargeError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      toast({
        title: "Cobrança criada",
        description: "A cobrança foi criada com sucesso",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar cobrança",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ChargeFormData) => {
    setIsLoading(true);
    createCharge.mutate(data);
    setIsLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
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
                    <Input placeholder="Digite o nome do cliente" {...field} />
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
                  <FormLabel>E-mail do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite o e-mail do cliente"
                      {...field}
                    />
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
                  <FormLabel>CPF/CNPJ do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o CPF ou CNPJ do cliente"
                      {...field}
                    />
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
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Digite o valor"
                      {...field}
                    />
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableMethods.map((method) => (
                        <SelectItem key={method.id} value={method.method}>
                          {method.method === "pix"
                            ? "PIX"
                            : method.method === "credit_card"
                            ? "Cartão de Crédito"
                            : "Boleto"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Cobrança"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
