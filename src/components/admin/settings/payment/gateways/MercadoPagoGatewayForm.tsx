import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function MercadoPagoGatewayForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [environment, setEnvironment] = useState("sandbox");

  const { data: gatewaySettings } = useQuery({
    queryKey: ["payment-gateway-settings", "mercadopago", session?.user?.id],
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

  useEffect(() => {
    if (gatewaySettings) {
      setApiKey(gatewaySettings.api_key || "");
      setEnvironment(gatewaySettings.environment || "sandbox");
    }
  }, [gatewaySettings]);

  const mutation = useMutation({
    mutationFn: async (values: {
      api_key: string;
      environment: string;
    }) => {
      if (!session?.user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("payment_gateway_settings")
        .upsert({
          company_id: session.user.id,
          gateway: "mercadopago",
          api_key: values.api_key,
          environment: values.environment,
          enabled: true,
        }, {
          onConflict: "company_id,gateway",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateway-settings"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações do Mercado Pago foram atualizadas com sucesso.",
      });
      navigate("/dashboard/settings");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações do Mercado Pago.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      api_key: apiKey,
      environment: environment,
    });
  };

  const handleBack = () => {
    navigate("/dashboard/settings");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey">Access Token</label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Insira seu Access Token do Mercado Pago"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="environment">Ambiente</label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar configurações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}