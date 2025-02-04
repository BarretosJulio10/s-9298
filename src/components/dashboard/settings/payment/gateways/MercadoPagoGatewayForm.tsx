import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MercadoPagoGatewayFormData {
  api_key: string;
  enabled: boolean;
}

export function MercadoPagoGatewayForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existingSettings } = useQuery({
    queryKey: ["mercadopago-settings", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .eq("company_id", session.user.id)
        .eq("gateway", "mercadopago")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const form = useForm<MercadoPagoGatewayFormData>({
    defaultValues: {
      api_key: existingSettings?.api_key || "",
      enabled: existingSettings?.enabled || false,
    },
  });

  const onSubmit = async (data: MercadoPagoGatewayFormData) => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("payment_gateway_settings")
        .upsert(
          {
            company_id: session.user.id,
            gateway: "mercadopago",
            api_key: data.api_key,
            enabled: data.enabled,
            environment: "production", // Mercado Pago não tem sandbox
          },
          {
            onConflict: "company_id,gateway",
          }
        );

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      await queryClient.invalidateQueries({ 
        queryKey: ["mercadopago-settings", session.user.id] 
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações do Mercado Pago foram salvas com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/settings/payment")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Configurar Mercado Pago</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais do Mercado Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Token</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativo</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}