import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FormHeaderProps {
  onClose: () => void;
}

export function FormHeader({ onClose }: FormHeaderProps) {
  return (
    <DialogHeader className="p-6 border-b">
      <DialogTitle className="text-lg font-medium">Criar um novo cliente</DialogTitle>
    </DialogHeader>
  );
}