
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string | null;
}

export function QRCodeDialog({ open, onOpenChange, qrCode }: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code abaixo com seu WhatsApp para conectar
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code"
              className="w-64 h-64"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Abra o WhatsApp no seu celular e escaneie o QR Code para conectar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
