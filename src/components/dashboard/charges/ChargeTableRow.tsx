import { TableRow } from "@/components/ui/table";
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
import { ChargeActionsCell } from "./charge-row/ChargeActionsCell";

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
        <ChargeCustomerCell customerName={charge.customer_name} />
        <ChargeAmountCell amount={charge.amount} />
        <ChargeDateCell date={charge.due_date} />
        <ChargeStatusCell status={charge.status} />
        <ChargeMethodCell method={charge.payment_method} />
        <ChargeDateCell date={charge.payment_date || ""} />
        <ChargeActionsCell 
          status={charge.status} 
          onDelete={() => setIsDeleteDialogOpen(true)} 
        />
      </TableRow>

      <CancelChargeDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}