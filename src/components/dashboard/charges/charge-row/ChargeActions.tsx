import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ChargeActionsProps {
  paymentLink?: string;
  status: string;
  chargeId: string;
}

export function ChargeActions({ paymentLink, status, chargeId }: ChargeActionsProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  
  console.log("ChargeActions - paymentLink:", paymentLink);
  console.log("ChargeActions - status:", status);

  const handleCopyLink = async () => {
    if (!paymentLink) {
      toast({
        variant: "destructive",
        title: "Link não disponível",
        description: "Esta cobrança ainda não possui um link de pagamento.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(paymentLink);
      toast({
        title: "Link copiado!",
        description: "O link de pagamento foi copiado para sua área de transferência.",
      });
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast({
        variant: "destructive",
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link de pagamento.",
      });
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentLink || status === 'paid') return;

    try {
      // Extrai o ID da preferência do link do Mercado Pago
      const prefId = paymentLink.split('preference_id=')[1]?.split('&')[0];
      if (!prefId) throw new Error('ID da preferência não encontrado');

      console.log("Verificando pagamento com prefId:", prefId);

      const { data, error } = await supabase.functions.invoke('check-mercadopago-payment', {
        body: {
          payment_id: prefId,
          company_id: session?.user?.id
        }
      });

      console.log("Resposta da verificação:", data);

      if (error) throw error;

      if (data.status === 'approved') {
        toast({
          title: "Pagamento confirmado!",
          description: "O status da cobrança foi atualizado.",
        });
        // Recarrega a página para atualizar os dados
        window.location.reload();
      } else {
        toast({
          title: "Status verificado",
          description: "O pagamento ainda não foi confirmado.",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao verificar pagamento",
        description: "Não foi possível verificar o status do pagamento.",
      });
    }
  };

  if (!paymentLink) {
    return (
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">Sem link</span>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar link de pagamento</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(paymentLink, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Abrir link de pagamento</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {status !== 'paid' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={checkPaymentStatus}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Verificar pagamento</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}