import { Button } from "@/components/ui/button";

interface TemplateFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export function TemplateFormActions({ onCancel, isSubmitting, isEditing }: TemplateFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button variant="outline" onClick={onCancel} type="button">
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Template" : "Criar Template"}
      </Button>
    </div>
  );
}