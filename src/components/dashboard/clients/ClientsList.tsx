import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientForm } from "./ClientForm";
import { ClientSearchBar } from "./list/ClientSearchBar";
import { ClientStatus } from "./list/ClientStatus";
import { ClientActions } from "./list/ClientActions";
import { useClients } from "./list/useClients";

export function ClientsList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState("10");

  const { data: clientsWithCharges, isLoading } = useClients();

  const filteredClients = clientsWithCharges?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <ClientSearchBar
        perPage={perPage}
        searchTerm={searchTerm}
        onPerPageChange={setPerPage}
        onSearchChange={setSearchTerm}
      />

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
            {filteredClients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id.slice(0, 4)}</TableCell>
                <TableCell>{client.name}</TableCell>
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
                    onSend={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t">
          <p className="text-sm text-gray-500">
            Mostrando {filteredClients?.length || 0} de {clientsWithCharges?.length || 0} registros
          </p>
        </div>
      </div>

      <ClientForm 
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}