
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentGatewayList } from "@/components/admin/settings/payment/PaymentGatewayList";
import { StripeSettingsForm } from "@/components/admin/settings/payment/StripeSettingsForm";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [environment, setEnvironment] = useState("sandbox");

  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        if (data) {
          setApiKey(data.asaas_api_key || "");
          setEnvironment(data.asaas_environment || "sandbox");
        }
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: {
      asaas_api_key: string;
      asaas_environment: string;
    }) => {
      if (config?.id) {
        const { error } = await supabase
          .from("configurations")
          .update(values)
          .eq('id', config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("configurations")
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      asaas_api_key: apiKey,
      asaas_environment: environment,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList>
          <TabsTrigger value="gateways">Gateways de Pagamento</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="charges">Cobranças</TabsTrigger>
        </TabsList>

        <TabsContent value="gateways">
          <PaymentGatewayList />
        </TabsContent>

        <TabsContent value="stripe">
          <StripeSettingsForm />
        </TabsContent>

        <TabsContent value="asaas">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Asaas</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey">Chave API</label>
                  <Input
                    id="apiKey"
                    placeholder="Insira sua chave API do Asaas"
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
        </TabsContent>

        <TabsContent value="charges">
          <ChargeSettingsForm />
        </TabsContent>
      </Tabs>

      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações atuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Ambiente Asaas:</strong> {config.asaas_environment}
              </p>
              <p>
                <strong>Chave API Asaas:</strong>{" "}
                {config.asaas_api_key ? "Configurada" : "Não configurada"}
              </p>
              <p>
                <strong>ID do Produto Stripe:</strong>{" "}
                {config.stripe_product_id || "Não configurado"}
              </p>
              <p>
                <strong>ID do Preço Stripe:</strong>{" "}
                {config.stripe_price_id || "Não configurado"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;
