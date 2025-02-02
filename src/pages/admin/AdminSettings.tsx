import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [environment, setEnvironment] = useState("sandbox");

  const { data: configurations, isLoading } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const updateConfigurations = useMutation({
    mutationFn: async (values: { asaas_api_key?: string; asaas_environment?: string }) => {
      const { error } = await supabase
        .from("configurations")
        .upsert({
          id: configurations?.id || undefined,
          ...values,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar configurações",
      });
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values: { asaas_api_key?: string; asaas_environment?: string } = {};
    
    if (apiKey) {
      values.asaas_api_key = apiKey;
    }
    if (environment) {
      values.asaas_environment = environment;
    }

    updateConfigurations.mutate(values);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Asaas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="environment">Ambiente</Label>
              <Select
                value={environment}
                onValueChange={setEnvironment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="production">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Digite a API Key do Asaas"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <Button type="submit">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Atuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Ambiente: </span>
            <span className="capitalize">
              {configurations?.asaas_environment || "sandbox"}
            </span>
          </div>
          <div>
            <span className="font-semibold">API Key: </span>
            <span>
              {configurations?.asaas_api_key
                ? "••••••••" + configurations.asaas_api_key.slice(-4)
                : "Não configurado"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;