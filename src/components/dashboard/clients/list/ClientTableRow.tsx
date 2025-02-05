import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Send, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientStatus } from "./ClientStatus";

interface ClientTableRowProps {
  client: any;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientTableRow({ client, onSelect, onEdit, onDelete }: ClientTableRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-gray-50">
      <TableCell className="font-medium text-left">
        {client.code}
      </TableCell>
      <TableCell className="font-medium" onClick={onSelect}>
        {client.name}
      </TableCell>
      <TableCell className="text-center">{client.email}</TableCell>
      <TableCell className="text-center">{client.document}</TableCell>
      <TableCell className="text-center">{client.phone}</TableCell>
      <TableCell className="text-center">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(client.charge_amount)}
      </TableCell>
      <TableCell className="text-center">
        <ClientStatus status={client.paymentStatus} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-start gap-2">
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          {client.paymentLink && (
            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(client.paymentLink)}>
              <Link className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}