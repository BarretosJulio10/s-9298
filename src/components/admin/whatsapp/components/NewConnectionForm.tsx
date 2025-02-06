
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface NewConnectionFormProps {
  onCreateInstance: (name: string) => Promise<void>;
  isLoading: boolean;
}

export function NewConnectionForm({ onCreateInstance, isLoading }: NewConnectionFormProps) {
  const [connectionName, setConnectionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionName.trim()) {
      onCreateInstance(connectionName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Input
          placeholder="Nome da conexão"
          value={connectionName}
          onChange={(e) => setConnectionName(e.target.value)}
        />
      </div>
      <Button 
        type="submit"
        disabled={isLoading || !connectionName.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando instância...
          </>
        ) : (
          'Criar nova conexão'
        )}
      </Button>
    </form>
  );
}
