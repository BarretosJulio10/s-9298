import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NotificationRulesHeader } from "./notification-rules/NotificationRulesHeader";
import { NotificationRulesList } from "./notification-rules/NotificationRulesList";
import { NotificationRulesActions } from "./notification-rules/NotificationRulesActions";
import { useNotificationRules } from "./notification-rules/hooks/useNotificationRules";

export function NotificationRulesForm() {
  const {
    rules,
    templates,
    mutation,
    addRule,
    removeRule,
    updateRule,
  } = useNotificationRules();

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