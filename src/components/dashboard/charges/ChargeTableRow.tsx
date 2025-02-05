import { TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { CancelChargeDialog } from "./CancelChargeDialog";

interface ChargeTableRowProps {
  charge: {
    id: string;
    customer_name: string;
    amount: number;
    due_date: string;
    status: string;
    payment_method: string;
    payment_date?: string | null;
  };
}

export function ChargeTableRow({ charge }: ChargeTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('charges')
        .delete()
        .eq('id', charge.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["charges"] });

      toast({
        description: "Cobrança excluída com sucesso!",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir cobrança:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cobrança",
        description: "Não foi possível excluir a cobrança.",
      });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{charge.customer_name}</TableCell>
        <TableCell className="text-center">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(charge.amount)}
        </TableCell>
        <TableCell className="text-center">
          {new Date(charge.due_date).toLocaleDateString('pt-BR')}
        </TableCell>
        <TableCell className="text-center">{charge.status}</TableCell>
        <TableCell className="text-center">{charge.payment_method}</TableCell>
        <TableCell className="text-center">
          {charge.payment_date 
            ? new Date(charge.payment_date).toLocaleDateString('pt-BR')
            : '-'}
        </TableCell>
        <TableCell className="text-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={charge.status === "paid"}
            title="Excluir cobrança"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      <CancelChargeDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}