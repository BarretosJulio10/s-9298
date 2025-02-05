import { TableCell } from "@/components/ui/table";

interface ChargeCustomerCellProps {
  customerName: string;
}

export function ChargeCustomerCell({ customerName }: ChargeCustomerCellProps) {
  return <TableCell>{customerName}</TableCell>;
}