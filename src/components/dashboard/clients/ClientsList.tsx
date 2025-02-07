
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClientForm } from "./ClientForm";
import { ClientSearchBar } from "./list/ClientSearchBar";
import { ClientChargesHistory } from "./list/ClientChargesHistory";
import { useClients } from "./list/useClients";
import { ClientListHeader } from "./list/ClientListHeader";
import { ClientsTable } from "./list/ClientsTable";

export function ClientsList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

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
      <ClientListHeader 
        onNewClient={() => setShowForm(true)}
      />

      <ClientSearchBar
        perPage={perPage}
        searchTerm={searchTerm}
        onPerPageChange={setPerPage}
        onSearchChange={setSearchTerm}
      />

      <ClientsTable 
        clients={filteredClients || []}
        onSelectClient={setSelectedClient}
        onEdit={() => {}}
      />

      <ClientForm 
        open={showForm}
        onClose={() => setShowForm(false)}
      />

      <ClientChargesHistory
        clientId={selectedClient?.id || null}
        clientName={selectedClient?.name || ""}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
}
