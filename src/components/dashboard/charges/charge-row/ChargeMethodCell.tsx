import { TableCell } from "@/components/ui/table";

interface ChargeMethodCellProps {
  method: string;
}

export function ChargeMethodCell({ method }: ChargeMethodCellProps) {
  return (
    <TableCell className="text-center capitalize">
      {method === "pix" ? "PIX" : method}
    </TableCell>
  );
}