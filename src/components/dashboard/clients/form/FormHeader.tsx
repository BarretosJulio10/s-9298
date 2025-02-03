import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FormHeaderProps {
  onClose: () => void;
}

export function FormHeader({ onClose }: FormHeaderProps) {
  return (
    <DialogHeader className="p-6 border-b">
      <DialogTitle className="text-lg font-medium">Criar um novo cliente</DialogTitle>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-4 top-4"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
}