import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardActionsProps {
  onNewTemplate: () => void;
}

export function DashboardActions({ onNewTemplate }: DashboardActionsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onNewTemplate} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Novo Template
      </Button>
    </div>
  );
}
