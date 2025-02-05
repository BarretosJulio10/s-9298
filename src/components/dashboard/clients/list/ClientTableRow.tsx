import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClientTableRowProps {
  client: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
    code: string;
    charge_amount: number;
  };
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientTableRow({ client, onSelect, onEdit, onDelete }: ClientTableRowProps) {
  const handleRowClick = () => {
    onSelect();
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium text-left">
        {client.code}
      </TableCell>
      <TableCell className="font-medium cursor-pointer" onClick={handleRowClick}>
        {client.name}
      </TableCell>
      <TableCell className="text-center">{client.email}</TableCell>
      <TableCell className="text-center">{client.document}</TableCell>
      <TableCell className="text-center">{client.phone}</TableCell>
      <TableCell className="text-center">
        R$ {client.charge_amount.toFixed(2)}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}