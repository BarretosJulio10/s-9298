import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, Send, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CancelChargeDialog } from "./CancelChargeDialog";
import { Badge } from "@/components/ui/badge";
import { EditChargeDialog } from "./charge-list/EditChargeDialog";

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

  const handleCopyLink = async () => {
    if (!charge.payment_link) {
      toast({
        variant: "destructive",
        description: "Link de pagamento não disponível.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(charge.payment_link);
      toast({
        description: "Link de pagamento copiado!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erro ao copiar link de pagamento.",
      });
    }
  };

  const handleSendCharge = async () => {
    try {
      const { data: config } = await supabase
        .from('configurations')
        .select('whatsapp_instance_id')
        .single();

      if (!config?.whatsapp_instance_id) {
        toast({
          variant: "destructive",
          description: "Configuração do WhatsApp não encontrada.",
        });
        return;
      }

      const message = `Olá ${charge.customer_name}, você tem uma cobrança pendente no valor de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(charge.amount)}. Clique no link para pagar: ${charge.payment_link}`;

      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          instance: config.whatsapp_instance_id,
          params: {
            phone: charge.customer_email, // Assumindo que o email está armazenando o telefone temporariamente
            message: message
          }
        })
      });

      if (!response.ok) throw new Error("Erro ao enviar mensagem");

      toast({
        description: "Cobrança enviada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao enviar cobrança:', error);
      toast({
        variant: "destructive",
        description: "Erro ao enviar cobrança.",
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
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Editar cobrança"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={charge.status === "paid"}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            {charge.payment_link && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  title="Enviar cobrança"
                  onClick={handleSendCharge}
                >
                  <Send className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  title="Copiar link"
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
              disabled={charge.status === "paid"}
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

      <EditChargeDialog
        charge={charge}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}