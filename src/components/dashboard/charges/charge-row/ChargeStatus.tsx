import { Badge } from "@/components/ui/badge";

interface ChargeStatusProps {
  status: string;
}

export function ChargeStatus({ status }: ChargeStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      case "cancelled":
        return "secondary";
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
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusColor(status)}>
      {formatStatus(status)}
    </Badge>
  );
}