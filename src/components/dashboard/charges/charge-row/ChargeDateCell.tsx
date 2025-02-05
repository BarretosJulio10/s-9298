import { TableCell } from "@/components/ui/table";

interface ChargeDateCellProps {
  date: string;
}

export function ChargeDateCell({ date }: ChargeDateCellProps) {
  return (
    <TableCell className="text-center">
      {new Date(date).toLocaleDateString('pt-BR')}
    </TableCell>
  );
}