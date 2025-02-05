
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Search } from "lucide-react";

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

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:client_id (
            name,
            email,
            document,
            phone
          )
        `);

      if (error) throw error;
      return data as Invoice[];
    },
  });

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
      invoice.client.name,
      invoice.client.email,
      invoice.client.document,
      invoice.client.phone,
    ].map(field => field?.toLowerCase() || "");

    const matchesSearch = searchTerm === "" || searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );

    return matchesStatus && matchesSearch;
  });

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.client.name}</TableCell>
                <TableCell>{invoice.client.email}</TableCell>
                <TableCell>{invoice.client.document}</TableCell>
                <TableCell>{invoice.client.phone}</TableCell>
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
              </TableRow>
            ))}
            {filteredInvoices?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhuma fatura encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
