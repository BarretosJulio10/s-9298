import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileEdit, Ban, ExternalLink } from "lucide-react";

interface ChargeTableRowProps {
  charge: {
    id: string;
    customer_name: string;
    customer_document: string;
    amount: number;
    due_date: string;
    status: string;
    payment_method: string;
    payment_date: string | null;
    payment_link?: string;
  };
}

export function ChargeTableRow({ charge }: ChargeTableRowProps) {
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
    <TableRow>
      <TableCell>{charge.customer_name}</TableCell>
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
      <TableCell className="capitalize">
        {charge.payment_method === "pix" ? "PIX" : charge.payment_method}
      </TableCell>
      <TableCell>
        {charge.payment_date
          ? format(new Date(charge.payment_date), "dd/MM/yyyy", {
              locale: ptBR,
            })
          : "-"}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          {charge.payment_link && charge.status !== "cancelled" && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(charge.payment_link!)}
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
          {charge.status !== "cancelled" && charge.status !== "paid" && (
            <>
              <Button
                variant="outline"
                size="icon"
                title="Editar"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                title="Cancelar"
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