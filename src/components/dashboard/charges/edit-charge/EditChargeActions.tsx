import { Button } from "@/components/ui/button";

interface EditChargeActionsProps {
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditChargeActions({ onCancel, isLoading }: EditChargeActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} type="button">
        Cancelar
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
}