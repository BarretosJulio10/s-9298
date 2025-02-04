import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TemplateListHeaderProps {
  onNewTemplate: () => void;
}

export function TemplateListHeader({ onNewTemplate }: TemplateListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
      <Button onClick={onNewTemplate} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Novo Template
      </Button>
    </div>
  );
}