import { Button } from "@/components/ui/button";
import { Send, Edit, Trash, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientActionsProps {
  onSend: () => void;
  onEdit: () => void;
  onDelete: () => void;
  paymentLink?: string;
}

export function ClientActions({ onSend, onEdit, onDelete, paymentLink }: ClientActionsProps) {
  const { toast } = useToast();

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