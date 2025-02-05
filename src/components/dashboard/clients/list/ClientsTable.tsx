import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientActions } from "./ClientActions";
import { ClientStatus } from "./ClientStatus";

interface ClientsTableProps {
  clients: any[];
  onSelectClient: (client: { id: string; name: string }) => void;
  onSendMessage: () => void;
  onEdit: () => void;
}

export function ClientsTable({ clients, onSelectClient, onSendMessage, onEdit }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead className="w-[180px]">Nome</TableHead>
            <TableHead className="text-center">WhatsApp</TableHead>
            <TableHead className="text-center">Data</TableHead>
            <TableHead className="text-center">Valor Cobrança</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.id.slice(0, 4)}</TableCell>
              <TableCell>
                <button
                  onClick={() => onSelectClient({ id: client.id, name: client.name })}
                  className="text-left hover:text-primary transition-colors"
                >
                  {client.name}
                </button>
              </TableCell>
              <TableCell className="text-center">{client.phone}</TableCell>
              <TableCell className="text-center">
                {new Date(client.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-center">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(client.charge_amount)}
              </TableCell>
              <TableCell className="text-center">
                <ClientStatus status={client.paymentStatus} />
              </TableCell>
              <TableCell>
                <ClientActions
                  onSend={onSendMessage}
                  onEdit={onEdit}
                  paymentLink={client.paymentLink}
                  client={{
                    id: client.id,
                    name: client.name,
                    email: client.email,
                    document: client.document,
                    phone: client.phone,
                    charge_amount: client.charge_amount
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <p className="text-sm text-gray-500">
          Mostrando {clients.length} registros
        </p>
      </div>
    </div>
  );
}