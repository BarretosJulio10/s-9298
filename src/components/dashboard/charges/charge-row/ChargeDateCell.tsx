import { TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChargeDateCellProps {
  date: string;
}

export function ChargeDateCell({ date }: ChargeDateCellProps) {
  return (
    <TableCell className="text-center">
      {format(new Date(date), "dd/MM/yyyy", {
        locale: ptBR,
      })}
    </TableCell>
  );
}