import { Button } from "@/components/ui/button";

interface EditInvoiceActionsProps {
  onClose: () => void;
}

export function EditInvoiceActions({ onClose }: EditInvoiceActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit">
        Salvar
      </Button>
    </div>
  );
}