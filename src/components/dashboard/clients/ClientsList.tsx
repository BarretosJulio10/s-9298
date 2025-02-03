import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Send, Edit, Trash, Check, Clock, X } from "lucide-react";
import { useState } from "react";
import { ClientForm } from "./ClientForm";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export function ClientsList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState("10");
  const { toast } = useToast();

  const { data: clientsWithCharges, isLoading } = useQuery({
    queryKey: ["clients-with-charges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select(`
          *,
          client_charges (
            status,
            due_date
          )
        `)
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (clientsError) {
        console.error("Erro ao buscar clientes:", clientsError);
        throw clientsError;
      }

      return clients.map(client => ({
        ...client,
        paymentStatus: getPaymentStatus(client.client_charges)
      }));
    }
  });

  const getPaymentStatus = (charges: any[]) => {
    if (!charges || charges.length === 0) return "pending";
    
    const latestCharge = charges[0];
    if (!latestCharge) return "pending";

    if (latestCharge.status === "paid") return "paid";
    
    const dueDate = new Date(latestCharge.due_date);
    const today = new Date();
    
    if (dueDate < today) return "overdue";
    return "sent";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-4 w-4 text-green-600" />;
      case "overdue":
        return <X className="h-4 w-4 text-red-600" />;
      case "sent":
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "overdue":
        return "Atrasado";
      case "sent":
        return "Enviado";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const filteredClients = clientsWithCharges?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Exibir</span>
          <Select value={perPage} onValueChange={setPerPage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">resultados por página</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Pesquisar</span>
          <Input
            type="search"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
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
                  <TableCell className="text-center">{new Date(client.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-center">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(client.charge_amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(client.paymentStatus)}
                      <span className="text-sm">{getStatusText(client.paymentStatus)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        title="Enviar cobrança"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Excluir cliente"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
      )}

      <ClientForm 
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
}