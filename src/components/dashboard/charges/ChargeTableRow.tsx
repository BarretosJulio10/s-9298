import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

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
  return (
    <TableRow>
      <TableCell>{charge.id.slice(0, 4)}</TableCell>
      <TableCell>{charge.customer_name}</TableCell>
      <TableCell>{charge.customer_document}</TableCell>
      <TableCell>
        {format(new Date(charge.due_date), "dd/MM/yyyy", {
          locale: ptBR,
        })}
      </TableCell>
      <TableCell className="font-medium">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(charge.amount)}
      </TableCell>
      <TableCell>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <Send className="h-4 w-4 mr-2" />
          Enviar cobrança
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="secondary" size="sm">
          Opções
        </Button>
      </TableCell>
    </TableRow>
  );
}