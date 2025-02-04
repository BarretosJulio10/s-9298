import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function PagHiperGatewayForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [apiToken, setApiToken] = useState("");

  const { data: gatewaySettings } = useQuery({
    queryKey: ["payment-gateway-settings", "paghiper", session?.user?.id],
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

  const mutation = useMutation({
    mutationFn: async (values: {
      api_key: string;
      api_token: string;
    }) => {
      if (!session?.user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("payment_gateway_settings")
        .upsert(
          {
            company_id: session.user.id,
            gateway: "paghiper",
            api_key: values.api_key,
            api_secret: values.api_token,
            enabled: true,
            environment: "production",
          },
          {
            onConflict: "company_id,gateway",
          }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-gateway-settings"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações do PagHiper foram atualizadas com sucesso.",
      });
      navigate("/dashboard/settings");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações do PagHiper.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      api_key: apiKey,
      api_token: apiToken,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard/settings")}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey">Chave de API</label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Insira sua chave de API do PagHiper"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="apiToken">Token API</label>
              <Input
                id="apiToken"
                type="password"
                placeholder="Insira seu token API do PagHiper"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
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