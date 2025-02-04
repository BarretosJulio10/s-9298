import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChargeActionsProps {
  paymentLink?: string;
  status: string;
  onEdit?: () => void;
  onCancel?: () => void;
}

export function ChargeActions({ paymentLink, status, onEdit, onCancel }: ChargeActionsProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    if (!paymentLink) return;

    try {
      await navigator.clipboard.writeText(paymentLink);
      toast({
        title: "Link copiado!",
        description: "O link de pagamento foi copiado para sua área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link de pagamento.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {paymentLink && status !== "cancelled" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          title="Copiar link de pagamento"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}