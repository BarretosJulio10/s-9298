import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationRulesHeader } from "./NotificationRulesHeader";
import { NotificationRulesList } from "./NotificationRulesList";
import { NotificationRulesActions } from "./NotificationRulesActions";

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
  });

  React.useEffect(() => {
    if (existingRules && existingRules.length > 0) {
      setRules(existingRules);
    } else {
      setRules([{ days_before: 2, days_after: 3, template_id: null, active: true }]);
    }
  }, [existingRules]);

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
      <NotificationRulesHeader />
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <NotificationRulesList
            rules={rules}
            templates={templates || []}
            onAddRule={addRule}
            onUpdateRule={updateRule}
            onRemoveRule={removeRule}
          />
          <NotificationRulesActions isSubmitting={mutation.isPending} />
        </form>
      </CardContent>
    </Card>
  );
}