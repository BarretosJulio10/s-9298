import { Button } from "@/components/ui/button";
import { Copy, FileEdit, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChargeActionsProps {
  paymentLink?: string;
  status: string;
  onEdit: () => void;
  onCancel: () => void;
}

export function ChargeActions({ paymentLink, status, onEdit, onCancel }: ChargeActionsProps) {
  const { toast } = useToast();

  const handleCopyLink = async () => {
    if (paymentLink) {
      await navigator.clipboard.writeText(paymentLink);
      toast({
        description: "Link de pagamento copiado!",
      });
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {paymentLink && status !== "cancelled" && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          title="Copiar link"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      {status !== "cancelled" && status !== "paid" && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="Editar"
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={onCancel}
            title="Cancelar"
          >
            <Ban className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}