
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditInvoiceForm } from "../EditInvoiceForm";
import { EditInvoiceHeader } from "./EditInvoiceHeader";
import { Invoice } from "../types/Invoice";

interface EditInvoiceDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInvoiceDialog({ invoice, open, onOpenChange }: EditInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <EditInvoiceHeader />
        <EditInvoiceForm invoice={invoice} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
