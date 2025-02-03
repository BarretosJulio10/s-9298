import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardActionsProps {
  onNewCharge: () => void;
}

export function DashboardActions({ onNewCharge }: DashboardActionsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onNewCharge} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nova Cobrança
      </Button>
    </div>
  );
}