import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CancelChargeDialog } from "./CancelChargeDialog";
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "overdue":
        return "Vencido";
      default:
        return status;
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
        <TableCell className="text-center">
          <Badge variant={getStatusColor(charge.status)}>
            {formatStatus(charge.status)}
          </Badge>
        </TableCell>
        <TableCell className="text-center capitalize">
          {charge.payment_method === "pix" ? "PIX" : charge.payment_method}
        </TableCell>
        <TableCell className="text-center">
          {charge.payment_date 
            ? new Date(charge.payment_date).toLocaleDateString('pt-BR')
            : "-"}
        </TableCell>
        <TableCell>
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Excluir cobrança"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
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