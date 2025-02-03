import { Check, Clock, X } from "lucide-react";

interface ClientStatusProps {
  status: string;
}

export function ClientStatus({ status }: ClientStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <X className="h-4 w-4 text-red-600" />;
      case "sent":
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "overdue":
        return "Atrasado";
      case "sent":
        return "Enviado";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {getStatusIcon(status)}
      <span className="text-sm">{getStatusText(status)}</span>
    </div>
  );
}