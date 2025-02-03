import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", user.id);

      if (error) {
        console.error("Erro ao buscar clientes:", error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir cliente",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Cliente excluído com sucesso!",
      });
      fetchClients();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: error.message,
      });
    }
  };

  if (!clients.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum cliente cadastrado
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor Cobrança</TableHead>
            <TableHead className="text-right pr-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.document}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                {client.created_at && format(new Date(client.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(client.charge_amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1 pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    title="Enviar cobrança"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:text-primary/90 hover:bg-primary/10"
                    title="Editar cliente"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    title="Excluir cliente"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}