import { Button } from "@/components/ui/button";
import { Send, Edit, Trash, Link2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ClientActionsProps {
  onSend: () => void;
  onEdit: () => void;
  onDelete: () => void;
  paymentLink?: string | null;
  client: {
    id: string;
    name: string;
    email: string;
    document: string;
    charge_amount: number;
  };
}

export function ClientActions({ onSend, onEdit, onDelete, paymentLink, client }: ClientActionsProps) {
  const { toast } = useToast();
  const { session } = useAuth();

  const handleGenerateCharge = async () => {
    if (!session?.user?.id) return;

    try {
      // Primeiro, cria a cobrança no banco
      const { data: charge, error: chargeError } = await supabase
        .from("charges")
        .insert({
          company_id: session.user.id,
          customer_name: client.name,
          customer_email: client.email,
          customer_document: client.document,
          amount: client.charge_amount,
          due_date: new Date().toISOString().split('T')[0], // Data atual como vencimento
          status: "pending",
          payment_method: "pix"
        })
        .select()
        .single();

      if (chargeError) throw chargeError;

      // Gera o link de pagamento via Mercado Pago
      const { data: mpResponse, error } = await supabase.functions.invoke('mercadopago', {
        body: {
          action: "create_charge",
          charge: {
            customer_name: client.name,
            customer_email: client.email,
            customer_document: client.document,
            amount: client.charge_amount,
            due_date: new Date().toISOString().split('T')[0],
            payment_method: "pix"
          },
          company_id: session.user.id
        },
      });

      if (error) throw error;

      // Atualiza a cobrança com o link de pagamento
      const { error: updateError } = await supabase
        .from("charges")
        .update({ 
          payment_link: mpResponse.payment_link,
          status: mpResponse.status 
        })
        .eq("id", charge.id);

      if (updateError) throw updateError;

      toast({
        title: "Link de pagamento gerado",
        description: "O link foi gerado com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao gerar cobrança:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar link",
        description: error.message,
      });
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast({
        description: "Link de pagamento copiado!",
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        title="Enviar cobrança"
        onClick={onSend}
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Gerar link de pagamento"
        onClick={handleGenerateCharge}
      >
        <Link2 className="h-4 w-4" />
      </Button>
      {paymentLink && (
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Copiar link de pagamento"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Editar cliente"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Excluir cliente"
        onClick={onDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}