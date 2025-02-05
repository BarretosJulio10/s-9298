import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";

interface ClientListHeaderProps {
  onNewClient: () => void;
  onSendNotifications: () => void;
  sending: boolean;
}

export function ClientListHeader({ onNewClient, onSendNotifications, sending }: ClientListHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Button 
        onClick={onNewClient} 
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Novo Cliente
      </Button>

      <Button
        onClick={onSendNotifications}
        disabled={sending}
        variant="secondary"
      >
        <Send className="h-4 w-4 mr-2" />
        {sending ? "Enviando..." : "Enviar Notificações"}
      </Button>
    </div>
  );
}