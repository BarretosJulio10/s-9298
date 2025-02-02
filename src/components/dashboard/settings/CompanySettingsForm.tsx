import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

interface CompanySettingsFormData {
  asaas_api_key: string;
  asaas_environment: "sandbox" | "production";
}

export function CompanySettingsForm() {
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<CompanySettingsFormData>();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["company-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (data: CompanySettingsFormData) => {
      const { error } = await supabase
        .from("company_settings")
        .upsert({
          company_id: session?.user?.id,
          asaas_api_key: data.asaas_api_key,
          asaas_environment: data.asaas_environment,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
      });
    },
  });

  const onSubmit = (data: CompanySettingsFormData) => {
    updateSettings.mutate(data);
  };

  if (isLoading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Asaas</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asaas_api_key"
              defaultValue={settings?.asaas_api_key || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave API do Asaas</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua chave API"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asaas_environment"
              defaultValue={settings?.asaas_environment || "sandbox"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ambiente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Testes)</SelectItem>
                      <SelectItem value="production">Produção</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}