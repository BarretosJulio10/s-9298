import { Button } from "@/components/ui/button";
import { Copy, FileEdit, Ban, ExternalLink } from "lucide-react";

interface ChargeActionsProps {
  paymentLink?: string;
  status: string;
  onCopyLink: (link: string) => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function ChargeActions({
  paymentLink,
  status,
  onCopyLink,
  onEdit,
  onCancel,
}: ChargeActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {paymentLink && status !== "cancelled" && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onCopyLink(paymentLink)}
            title="Copiar link"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(paymentLink, '_blank')}
            title="Abrir link"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </>
      )}
      {status !== "cancelled" && (
        <>
          <Button
            variant="outline"
            size="icon"
            title="Editar"
            disabled={status === "paid"}
            onClick={onEdit}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            title="Cancelar"
            disabled={status === "paid"}
            onClick={onCancel}
          >
            <Ban className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}