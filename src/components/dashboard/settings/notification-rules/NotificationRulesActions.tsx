import { Button } from "@/components/ui/button";

interface NotificationRulesActionsProps {
  isSubmitting: boolean;
}

export function NotificationRulesActions({ isSubmitting }: NotificationRulesActionsProps) {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Salvando..." : "Salvar Regras"}
    </Button>
  );
}