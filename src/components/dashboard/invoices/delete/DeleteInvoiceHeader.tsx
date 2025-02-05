
import { AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

export function DeleteInvoiceHeader() {
  return (
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir Fatura</AlertDialogTitle>
      <AlertDialogDescription>
        Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}
