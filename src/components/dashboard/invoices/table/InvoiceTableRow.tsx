import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Send } from "lucide-react";
import { Invoice } from "../types/Invoice";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
}

export function InvoiceTableRow({ 
  invoice, 
  onEdit, 
  onDelete,
  onSend,
}: InvoiceTableRowProps) {
  return (
    <TableRow>
      <TableCell>{invoice.code}</TableCell>
      <TableCell>{invoice.client.name}</TableCell>
      <TableCell>{invoice.client.document}</TableCell>
      <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
      <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
      <TableCell>{invoice.status}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSend(invoice)}
            title="Enviar fatura"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(invoice)}
            title="Editar fatura"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(invoice)}
            title="Excluir fatura"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}