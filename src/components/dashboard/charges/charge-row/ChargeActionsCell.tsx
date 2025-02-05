import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ChargeActionsCellProps {
  status: string;
  onDelete: () => void;
}

export function ChargeActionsCell({ status, onDelete }: ChargeActionsCellProps) {
  return (
    <TableCell className="text-right pr-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onDelete}
        disabled={status === "paid"}
        title="Excluir cobrança"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </TableCell>
  );
}