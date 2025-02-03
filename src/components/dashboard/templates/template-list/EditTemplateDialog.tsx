import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TemplateForm } from "../TemplateForm";

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
}

export function EditTemplateDialog({ open, onOpenChange, template }: EditTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Template</DialogTitle>
        </DialogHeader>
        <TemplateForm />
      </DialogContent>
    </Dialog>
  );
}