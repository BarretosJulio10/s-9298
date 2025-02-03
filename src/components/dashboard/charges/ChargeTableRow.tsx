import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, FileEdit, Ban, ExternalLink } from "lucide-react";

interface ChargeTableRowProps {
  charge: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_document: string;
    amount: number;
    due_date: string;
    status: string;
    payment_method: string;
    payment_date: string | null;
    payment_link?: string;
  };
  onCopyLink: (link: string) => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function ChargeTableRow({ charge, onCopyLink, onEdit, onCancel }: ChargeTableRowProps) {
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

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "boleto":
        return "Boleto";
      case "credit_card":
        return "Cartão de Crédito";
      default:
        return method;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{charge.customer_name}</p>
          <p className="text-sm text-muted-foreground">{charge.customer_email}</p>
        </div>
      </TableCell>
      <TableCell>{charge.customer_document}</TableCell>
      <TableCell className="font-medium">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(charge.amount)}
      </TableCell>
      <TableCell>
        {format(new Date(charge.due_date), "dd/MM/yyyy", {
          locale: ptBR,
        })}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusColor(charge.status)}>
          {formatStatus(charge.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {formatPaymentMethod(charge.payment_method)}
      </TableCell>
      <TableCell>
        {charge.payment_date
          ? format(new Date(charge.payment_date), "dd/MM/yyyy", {
              locale: ptBR,
            })
          : "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {charge.payment_link && charge.status !== "cancelled" && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopyLink(charge.payment_link!)}
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(charge.payment_link, '_blank')}
                title="Abrir link"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
          {charge.status !== "cancelled" && (
            <>
              <Button
                variant="outline"
                size="icon"
                title="Editar"
                disabled={charge.status === "paid"}
                onClick={onEdit}
              >
                <FileEdit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                title="Cancelar"
                disabled={charge.status === "paid"}
                onClick={onCancel}
              >
                <Ban className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}