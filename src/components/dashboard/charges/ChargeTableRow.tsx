
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CancelChargeDialog } from "./CancelChargeDialog";
import { ChargeCustomerCell } from "./charge-row/ChargeCustomerCell";
import { ChargeAmountCell } from "./charge-row/ChargeAmountCell";
import { ChargeDateCell } from "./charge-row/ChargeDateCell";
import { ChargeStatusCell } from "./charge-row/ChargeStatusCell";
import { ChargeMethodCell } from "./charge-row/ChargeMethodCell";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onDelete: () => void;
}

export function ChargeTableRow({ charge, onDelete }: ChargeTableRowProps) {
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
        <ChargeCustomerCell customerName={charge.customer_name} />
        <ChargeAmountCell amount={charge.amount} />
        <ChargeDateCell date={charge.due_date} />
        <ChargeStatusCell status={charge.status} />
        <ChargeMethodCell method={charge.payment_method} />
        <ChargeDateCell date={charge.payment_date || ""} />
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={charge.status === "paid"}
            title="Excluir cobrança"
          >
            <Trash2 className="h-4 w-4" />
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
