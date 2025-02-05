import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Send } from "lucide-react";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onEdit: (invoice: any) => void;
  onDelete: (invoiceId: string) => void;
  onSend: (invoice: any) => void;
  templateTypeTranslations: Record<string, string>;
}

export function InvoiceTableRow({ 
  invoice, 
  onEdit, 
  onDelete,
  onSend,
  templateTypeTranslations 
}: InvoiceTableRowProps) {
  return (
    <TableRow>
      <TableCell>{invoice.name}</TableCell>
      <TableCell>{templateTypeTranslations[invoice.type] || invoice.type}</TableCell>
      <TableCell className="max-w-md truncate">{invoice.content}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSend(invoice)}
            title="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(invoice)}
            title="Editar template"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(invoice.id)}
            title="Excluir template"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}