import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChargeCustomer } from "./charge-list/ChargeCustomer";
import { ChargeStatus } from "./charge-list/ChargeStatus";
import { ChargeActions } from "./charge-list/ChargeActions";

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
        <ChargeCustomer name={charge.customer_name} email={charge.customer_email} />
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
        <ChargeStatus status={charge.status} />
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
        <ChargeActions
          paymentLink={charge.payment_link}
          status={charge.status}
          onCopyLink={onCopyLink}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
}