
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

interface CreateInstanceFormProps {
  instanceName: string;
  onInstanceNameChange: (value: string) => void;
  onCreateInstance: () => void;
  isCreating: boolean;
}

export function CreateInstanceForm({
  instanceName,
  onInstanceNameChange,
  onCreateInstance,
  isCreating
}: CreateInstanceFormProps) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Nome da instância"
        value={instanceName}
        onChange={(e) => onInstanceNameChange(e.target.value)}
      />
      <Button onClick={onCreateInstance} disabled={isCreating || !instanceName}>
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Criar Instância
          </>
        )}
      </Button>
    </div>
  );
}
