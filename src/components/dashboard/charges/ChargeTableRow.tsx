import { TableRow } from "@/components/ui/table";
import { useState } from "react";
import { CancelChargeDialog } from "./CancelChargeDialog";
import { EditChargeDialog } from "./charge-list/EditChargeDialog";
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
    customer_email: string;
    amount: number;
    due_date: string;
    status: string;
    payment_link?: string | null;
    payment_method: string;
    payment_date?: string | null;
  };
}

export function ChargeTableRow({ charge }: ChargeTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
        <ChargeCustomerCell name={charge.customer_name} />
        <ChargeAmountCell amount={charge.amount} />
        <ChargeDateCell date={charge.due_date} />
        <ChargeStatusCell status={charge.status} />
        <ChargeMethodCell method={charge.payment_method} />
        <ChargeDateCell date={charge.payment_date || ""} />
        <ChargeActionsCell
          charge={charge}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
      </TableRow>

      <CancelChargeDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <EditChargeDialog
        charge={charge}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
