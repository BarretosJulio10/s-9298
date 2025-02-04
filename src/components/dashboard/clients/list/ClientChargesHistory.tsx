import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientStatus } from "./ClientStatus";

interface ClientChargesHistoryProps {
  clientId: string | null;
  clientName: string;
  onClose: () => void;
}

export function ClientChargesHistory({ clientId, clientName, onClose }: ClientChargesHistoryProps) {
  const { data: charges } = useQuery({
    queryKey: ["client-charges", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from("client_charges")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  return (
    <Dialog open={!!clientId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico de Cobranças - {clientName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Valor</TableHead>
                <TableHead className="text-center">Vencimento</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Método</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges?.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell>
                    {new Date(charge.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(charge.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(charge.due_date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <ClientStatus status={charge.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {charge.payment_method === 'pix' ? 'PIX' : 
                     charge.payment_method === 'credit_card' ? 'Cartão' : 
                     'Boleto'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}