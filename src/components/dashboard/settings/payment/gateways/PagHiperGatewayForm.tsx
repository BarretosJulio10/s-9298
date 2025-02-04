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

interface PagHiperGatewayFormData {
  api_key: string;
  api_secret: string;
  enabled: boolean;
}

export function PagHiperGatewayForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existingSettings } = useQuery({
    queryKey: ["paghiper-settings", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("payment_gateway_settings")
        .select("*")
        .eq("company_id", session.user.id)
        .eq("gateway", "paghiper")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const form = useForm<PagHiperGatewayFormData>({
    defaultValues: {
      api_key: existingSettings?.api_key || "",
      api_secret: existingSettings?.api_secret || "",
      enabled: existingSettings?.enabled || false,
    },
  });

  const onSubmit = async (data: PagHiperGatewayFormData) => {
    if (!session?.user?.id) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("payment_gateway_settings")
        .upsert(
          {
            company_id: session.user.id,
            gateway: "paghiper",
            api_key: data.api_key,
            api_secret: data.api_secret,
            enabled: data.enabled,
            environment: "production",
          },
          {
            onConflict: "company_id,gateway",
          }
        );

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["payment-gateways"] });
      await queryClient.invalidateQueries({ 
        queryKey: ["paghiper-settings", session.user.id] 
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações do PagHiper foram salvas com sucesso",
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
        <h2 className="text-2xl font-bold">Configurar PagHiper</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais do PagHiper</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="api_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Secret</FormLabel>
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