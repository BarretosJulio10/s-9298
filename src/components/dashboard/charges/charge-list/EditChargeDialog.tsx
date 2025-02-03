import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditChargeForm } from "../EditChargeForm";

interface EditChargeDialogProps {
  charge: any | null;
  onClose: () => void;
}

export function EditChargeDialog({ charge, onClose }: EditChargeDialogProps) {
  if (!charge) return null;

  return (
    <Dialog open={Boolean(charge)} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cobrança</DialogTitle>
        </DialogHeader>
        <EditChargeForm charge={charge} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}