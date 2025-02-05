import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Send, Link2, Pencil, Trash } from "lucide-react";

interface ChargeActionsCellProps {
  status: string;
  onDelete: () => void;
}

export function ChargeActionsCell({ status, onDelete }: ChargeActionsCellProps) {
  return (
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          disabled={status === "paid"}
          title="Enviar cobrança"
        >
          <Send className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          disabled={status === "paid"}
          title="Copiar link"
        >
          <Link2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 hover:bg-primary/10"
          disabled={status === "paid"}
          title="Editar cobrança"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
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
      </div>
    </TableCell>
  );
}