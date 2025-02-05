
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditInvoiceDialog } from "./EditInvoiceDialog";
import { DeleteInvoiceDialog } from "./DeleteInvoiceDialog";

interface Invoice {
  id: string;
  amount: number;
  status: string;
  due_date: string;
  payment_date: string | null;
  client: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}

export function InvoiceList() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      console.log("Buscando faturas para o usuário:", user.id);

      // Primeiro, vamos verificar se existem faturas diretamente
      const { count, error: countError } = await supabase
        .from("invoices")
        .select("*", { count: 'exact', head: true })
        .eq('company_id', user.id);

      if (countError) {
        console.error("Erro ao contar faturas:", countError);
        throw countError;
      }

      console.log("Total de faturas encontradas:", count);

      // Agora vamos buscar os dados completos
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:clients (
            name,
            email,
            document,
            phone
          )
        `)
        .eq('company_id', user.id);

      if (error) {
        console.error("Erro ao buscar faturas:", error);
        console.error("Detalhes do erro:", {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("Faturas encontradas:", data);
      
      // Verificando se os dados estão corretos
      if (data) {
        data.forEach((invoice, index) => {
          console.log(`Fatura ${index + 1}:`, {
            id: invoice.id,
            amount: invoice.amount,
            status: invoice.status,
            client: invoice.client
          });
        });
      }

      return data as Invoice[];
    },
  });

  if (error) {
    console.error("Erro na query:", error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar faturas",
      description: "Não foi possível carregar as faturas. Detalhes: " + (error as Error).message,
    });
  }

  const handleDelete = async () => {
    if (!deletingInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', deletingInvoice.id);

      if (error) throw error;

      toast({
        title: "Fatura excluída",
        description: "A fatura foi excluída com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setDeletingInvoice(null);
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a fatura.",
      });
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    toast({
      title: "Enviar fatura",
      description: "Funcionalidade a ser implementada.",
    });
  };

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

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const searchFields = [
      invoice.client?.name,
      invoice.client?.email,
      invoice.client?.document,
      invoice.client?.phone,
    ].map(field => field?.toLowerCase() || "");

    const matchesSearch = searchTerm === "" || searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div>Carregando faturas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome, email, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
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
                      onClick={() => handleSendInvoice(invoice)}
                      title="Enviar fatura"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingInvoice(invoice)}
                      title="Editar fatura"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletingInvoice(invoice)}
                      className="text-destructive hover:text-destructive"
                      title="Excluir fatura"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!filteredInvoices || filteredInvoices.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Nenhuma fatura encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EditInvoiceDialog
        invoice={editingInvoice}
        open={!!editingInvoice}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
      />

      <DeleteInvoiceDialog
        open={!!deletingInvoice}
        onOpenChange={(open) => !open && setDeletingInvoice(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
