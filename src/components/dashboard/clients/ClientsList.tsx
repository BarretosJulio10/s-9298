import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Search, Send } from "lucide-react";
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
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("clients")
        .select(`
          id,
          name,
          email,
          document,
          phone,
          status,
          birth_date,
          charge_amount,
          payment_methods,
          charge_type,
          company_id,
          created_at,
          plans (
            name
          )
        `)
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Client & { plans: { name: string } | null })[];
    }
  });

  const filteredClients = clients?.filter(client =>
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
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Cobrança rápida</TableHead>
                <TableHead>Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id.slice(0, 4)}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{new Date(client.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{client.plans?.name || "****"}</TableCell>
                  <TableCell>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar cobrança
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      Opções
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500">
              Mostrando {filteredClients?.length || 0} de {clients?.length || 0} registros
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