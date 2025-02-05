import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, Send, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChargeActionsCellProps {
  charge: {
    id: string;
    payment_link?: string | null;
    status: string;
    customer_email: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function ChargeActionsCell({ charge, onEdit, onDelete }: ChargeActionsCellProps) {
  const { toast } = useToast();

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

      const message = `Olá, você tem uma cobrança pendente. Clique no link para pagar: ${charge.payment_link}`;

      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMessage",
          instance: config.whatsapp_instance_id,
          params: {
            phone: charge.customer_email,
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

  return (
    <TableCell>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Editar cobrança"
          onClick={onEdit}
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
          onClick={onDelete}
          disabled={charge.status === "paid"}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  );
}