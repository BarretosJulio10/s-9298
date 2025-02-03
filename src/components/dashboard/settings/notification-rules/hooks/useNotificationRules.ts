import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type NotificationRule = Database["public"]["Tables"]["notification_rules"]["Row"];

export function useNotificationRules() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rules, setRules] = useState<NotificationRule[]>([]);

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
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setRules(data);
      } else {
        initializeDefaultRule();
      }
    },
  });

  const initializeDefaultRule = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const defaultRule: NotificationRule = {
      id: crypto.randomUUID(),
      company_id: user.id,
      days_before: 2,
      days_after: 3,
      template_id: null,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setRules([defaultRule]);
  };

  const mutation = useMutation({
    mutationFn: async (rules: NotificationRule[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("notification_rules")
        .upsert(rules);

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

  const addRule = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setRules([...rules, {
      id: crypto.randomUUID(),
      company_id: user.id,
      days_before: 2,
      days_after: 3,
      template_id: null,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
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

  return {
    rules,
    templates,
    mutation,
    addRule,
    removeRule,
    updateRule,
  };
}