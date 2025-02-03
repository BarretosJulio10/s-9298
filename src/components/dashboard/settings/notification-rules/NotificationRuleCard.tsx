import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash } from "lucide-react";

interface NotificationRule {
  id?: string;
  days_before: number;
  days_after: number;
  template_id: string | null;
  active: boolean;
}

interface NotificationRuleCardProps {
  rule: NotificationRule;
  index: number;
  templates: any[];
  onUpdate: (index: number, field: keyof NotificationRule, value: any) => void;
  onRemove: (index: number) => void;
}

export function NotificationRuleCard({
  rule,
  index,
  templates,
  onUpdate,
  onRemove
}: NotificationRuleCardProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={rule.active}
            onCheckedChange={(checked) => onUpdate(index, "active", checked)}
          />
          <span className="text-sm font-medium">
            {rule.active ? "Ativa" : "Inativa"}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
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
            onChange={(e) => onUpdate(index, "days_before", parseInt(e.target.value))}
            min={0}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`days_after_${index}`}>Dias após o vencimento</label>
          <Input
            id={`days_after_${index}`}
            type="number"
            value={rule.days_after}
            onChange={(e) => onUpdate(index, "days_after", parseInt(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`template_${index}`}>Template de mensagem</label>
        <Select
          value={rule.template_id || ""}
          onValueChange={(value) => onUpdate(index, "template_id", value)}
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
  );
}