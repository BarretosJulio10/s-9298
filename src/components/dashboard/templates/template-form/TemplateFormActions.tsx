import { Button } from "@/components/ui/button";

interface TemplateFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export function TemplateFormActions({ onCancel, isSubmitting, isEditing }: TemplateFormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} type="button">
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Atualizar" : "Criar"} Template
      </Button>
    </div>
  );
}