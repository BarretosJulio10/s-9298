import { Button } from "@/components/ui/button";

interface FormFooterProps {
  onClose: () => void;
}

export function FormFooter({ onClose }: FormFooterProps) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        Fechar
      </Button>
      <Button 
        type="submit"
        className="bg-primary hover:bg-primary/90"
      >
        Adicionar
      </Button>
    </div>
  );
}