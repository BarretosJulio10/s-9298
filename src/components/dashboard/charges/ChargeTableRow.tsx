import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Send, Link2, Copy, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CancelChargeDialog } from "./CancelChargeDialog";

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
  };
}

export function ChargeTableRow({ charge }: ChargeTableRowProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopyLink = () => {
    if (charge.payment_link) {
      navigator.clipboard.writeText(charge.payment_link);
      toast({
        description: "Link de pagamento copiado!",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('charges')
        .delete()
        .eq('id', charge.id);

      if (error) throw error;

      // Atualiza a lista de cobranças
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
        <TableCell>{charge.id.slice(0, 5)}</TableCell>
        <TableCell>{charge.customer_name}</TableCell>
        <TableCell>{charge.customer_email}</TableCell>
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
        <TableCell>
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Enviar cobrança"
            >
              <Send className="h-4 w-4" />
            </Button>
            {charge.payment_link && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Link de pagamento"
                  onClick={() => window.open(charge.payment_link, '_blank')}
                >
                  <Link2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Copiar link de pagamento"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            )}
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