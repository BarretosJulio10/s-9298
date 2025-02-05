import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Send, Trash2 } from "lucide-react";
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
  onSend 
}: InvoiceTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.code}</TableCell>
      <TableCell>{invoice.client?.name || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.email || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.document || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.phone || 'N/A'}</TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(invoice.amount)}
      </TableCell>
      <TableCell>
        {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSend(invoice)}
            title="Enviar fatura"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(invoice)}
            title="Editar fatura"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(invoice)}
            className="text-destructive hover:text-destructive"
            title="Excluir fatura"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}