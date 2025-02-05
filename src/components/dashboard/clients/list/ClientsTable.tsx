import { Table, TableBody } from "@/components/ui/table";
import { ClientTableHeader } from "./ClientTableHeader";
import { ClientTableRow } from "./ClientTableRow";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientsTableProps {
  clients: any[];
  onSelectClient: (client: { id: string; name: string }) => void;
  onEdit: () => void;
}

export function ClientsTable({ clients, onSelectClient, onEdit }: ClientsTableProps) {
  const { toast } = useToast();

  const handleDelete = async (clientId: string) => {
    try {
      // Primeiro, excluir as cobranças pendentes ou atrasadas
      const { error: chargesError } = await supabase
        .from('client_charges')
        .delete()
        .eq('client_id', clientId)
        .in('status', ['pending', 'overdue']);

      if (chargesError) throw chargesError;

      // Depois, excluir o cliente
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (clientError) throw clientError;

      toast({
        description: "Cliente e cobranças pendentes excluídos com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o cliente e suas cobranças.",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <ClientTableHeader />
        <TableBody>
          {clients.map((client) => (
            <ClientTableRow
              key={client.id}
              client={client}
              onSelect={() => onSelectClient({ id: client.id, name: client.name })}
              onEdit={onEdit}
              onDelete={() => handleDelete(client.id)}
            />
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Nenhum cliente encontrado
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}