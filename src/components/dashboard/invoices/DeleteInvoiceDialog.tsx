
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { DeleteInvoiceHeader } from "./delete/DeleteInvoiceHeader";
import { DeleteInvoiceActions } from "./delete/DeleteInvoiceActions";

interface DeleteInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteInvoiceDialog({ open, onOpenChange, onConfirm }: DeleteInvoiceDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <DeleteInvoiceHeader />
        <DeleteInvoiceActions onConfirm={onConfirm} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
