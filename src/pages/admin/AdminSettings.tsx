import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [environment, setEnvironment] = useState("sandbox");
  const [stripeProductId, setStripeProductId] = useState("");
  const [stripePriceId, setStripePriceId] = useState("");

  // Buscar configurações existentes
  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        if (data) {
          setApiKey(data.asaas_api_key || "");
          setEnvironment(data.asaas_environment || "sandbox");
          setStripeProductId(data.stripe_product_id || "");
          setStripePriceId(data.stripe_price_id || "");
        }
      }
    }
  });

  // Mutation para salvar configurações
  const mutation = useMutation({
    mutationFn: async (values: {
      asaas_api_key: string;
      asaas_environment: string;
      stripe_product_id?: string;
      stripe_price_id?: string;
    }) => {
      // Se já existe uma configuração, atualiza. Senão, cria uma nova.
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
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
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

      <Tabs defaultValue="asaas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="charges">Cobranças</TabsTrigger>
        </TabsList>

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

        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Stripe</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="stripeProductId">ID do Produto</label>
                  <Input
                    id="stripeProductId"
                    placeholder="prod_..."
                    value={stripeProductId}
                    onChange={(e) => setStripeProductId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    ID do produto no Stripe (começa com "prod_")
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="stripePriceId">ID do Preço</label>
                  <Input
                    id="stripePriceId"
                    placeholder="price_..."
                    value={stripePriceId}
                    onChange={(e) => setStripePriceId(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    ID do preço no Stripe (começa com "price_")
                  </p>
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