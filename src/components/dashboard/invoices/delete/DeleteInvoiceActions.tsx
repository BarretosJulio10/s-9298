
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface DeleteInvoiceActionsProps {
  onConfirm: () => void;
}

export function DeleteInvoiceActions({ onConfirm }: DeleteInvoiceActionsProps) {
  return (
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={onConfirm}
      >
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  );
}
