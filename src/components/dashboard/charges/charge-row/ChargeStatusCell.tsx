import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ChargeStatusCellProps {
  status: string;
}

export function ChargeStatusCell({ status }: ChargeStatusCellProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "overdue":
        return "Vencido";
      default:
        return status;
    }
  };

  return (
    <TableCell className="text-center">
      <Badge variant={getStatusColor(status)}>
        {formatStatus(status)}
      </Badge>
    </TableCell>
  );
}