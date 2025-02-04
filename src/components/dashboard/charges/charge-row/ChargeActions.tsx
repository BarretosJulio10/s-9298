import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChargeActionsProps {
  paymentLink?: string;
  status: string;
}

export function ChargeActions({ paymentLink, status }: ChargeActionsProps) {
  const { toast } = useToast();
  
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
    </div>
  );
}