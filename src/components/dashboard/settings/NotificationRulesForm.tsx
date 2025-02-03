import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash } from "lucide-react";

interface NotificationRule {
  id?: string;
  days_before: number;
  days_after: number;
  template_id: string | null;
  active: boolean;
}

export function NotificationRulesForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rules, setRules] = React.useState<NotificationRule[]>([]);

  // Buscar templates disponíveis
  const { data: templates } = useQuery({
    queryKey: ["message-templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .eq("company_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  // Buscar regras existentes
  const { data: existingRules } = useQuery({
    queryKey: ["notification-rules"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("notification_rules")
        .select("*")
        .eq("company_id", user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setRules(data);
      } else {
        setRules([{ days_before: 2, days_after: 3, template_id: null, active: true }]);
      }
    },
  });

  // Mutation para salvar regras
  const mutation = useMutation({
    mutationFn: async (rules: NotificationRule[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("notification_rules")
        .upsert(
          rules.map(rule => ({
            ...rule,
            company_id: user.id,
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-rules"] });
      toast({
        title: "Regras salvas",
        description: "As regras de notificação foram atualizadas com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar regras",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar as regras",
      });
    },
  });

  const addRule = () => {
    setRules([...rules, { days_before: 2, days_after: 3, template_id: null, active: true }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof NotificationRule, value: any) => {
    setRules(rules.map((rule, i) => {
      if (i === index) {
        return { ...rule, [field]: value };
      }
      return rule;
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(rules);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regras de Notificação Automática</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {rules.map((rule, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={(checked) => updateRule(index, "active", checked)}
                  />
                  <span className="text-sm font-medium">
                    {rule.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(index)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`days_before_${index}`}>Dias antes do vencimento</label>
                  <Input
                    id={`days_before_${index}`}
                    type="number"
                    value={rule.days_before}
                    onChange={(e) => updateRule(index, "days_before", parseInt(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`days_after_${index}`}>Dias após o vencimento</label>
                  <Input
                    id={`days_after_${index}`}
                    type="number"
                    value={rule.days_after}
                    onChange={(e) => updateRule(index, "days_after", parseInt(e.target.value))}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor={`template_${index}`}>Template de mensagem</label>
                <Select
                  value={rule.template_id || ""}
                  onValueChange={(value) => updateRule(index, "template_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addRule}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Regra
          </Button>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Salvar Regras"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}