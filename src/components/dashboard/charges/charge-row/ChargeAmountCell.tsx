import { TableCell } from "@/components/ui/table";

interface ChargeAmountCellProps {
  amount: number;
}

export function ChargeAmountCell({ amount }: ChargeAmountCellProps) {
  return (
    <TableCell className="text-center">
      {new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount)}
    </TableCell>
  );
}