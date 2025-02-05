
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChargeActionsCellProps {
  status: string;
  onDelete: () => void;
}

export function ChargeActionsCell({ status, onDelete }: ChargeActionsCellProps) {
  return (
    <TableCell>
      <div className="flex justify-end items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDelete}
          disabled={status === "paid"}
          title="Excluir cobrança"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  );
}
