import { TableCell } from "@/components/ui/table";

interface ChargeCustomerCellProps {
  name: string;
}

export function ChargeCustomerCell({ name }: ChargeCustomerCellProps) {
  return <TableCell>{name}</TableCell>;
}