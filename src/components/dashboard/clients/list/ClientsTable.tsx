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
      const { error } = await supabase.functions.invoke('delete-client', {
        body: { clientId }
      });

      if (error) throw error;

      toast({
        description: "Cliente e cobranças excluídos com sucesso!",
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