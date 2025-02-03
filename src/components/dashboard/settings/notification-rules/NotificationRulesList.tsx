import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NotificationRuleCard } from "./NotificationRuleCard";

interface NotificationRule {
  id?: string;
  days_before: number;
  days_after: number;
  template_id: string | null;
  active: boolean;
}

interface NotificationRulesListProps {
  rules: NotificationRule[];
  templates: any[];
  onAddRule: () => void;
  onUpdateRule: (index: number, field: keyof NotificationRule, value: any) => void;
  onRemoveRule: (index: number) => void;
}

export function NotificationRulesList({
  rules,
  templates,
  onAddRule,
  onUpdateRule,
  onRemoveRule
}: NotificationRulesListProps) {
  return (
    <div className="space-y-4">
      {rules.map((rule, index) => (
        <NotificationRuleCard
          key={index}
          rule={rule}
          index={index}
          templates={templates}
          onUpdate={onUpdateRule}
          onRemove={onRemoveRule}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddRule}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Regra
      </Button>
    </div>
  );
}