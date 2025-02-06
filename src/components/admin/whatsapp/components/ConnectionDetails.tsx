
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WhatsAppConnection } from "@/types/whatsapp";
import { WhatsAppStatus as IWhatsAppStatus } from "@/types/whatsapp";

interface ConnectionDetailsProps {
  connection: WhatsAppConnection;
  status: IWhatsAppStatus;
  onGenerateQR: () => Promise<void>;
  isLoading: boolean;
}

export function ConnectionDetails({ 
  connection, 
  status, 
  onGenerateQR, 
  isLoading 
}: ConnectionDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div className="text-sm font-medium">Nome da conexão</div>
        <div className="text-sm">{connection.name}</div>
        <div className="text-sm font-medium">ID da instância</div>
        <div className="text-sm font-mono bg-muted p-2 rounded-md">
          {connection.instance_key}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${
          status.status === 'connected' ? 'bg-green-500' : 
          status.status === 'connecting' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`} />
        <span className="text-sm">
          {status.status === 'connected' ? 'Conectado' : 
           status.status === 'connecting' ? 'Conectando...' : 
           'Desconectado'}
        </span>
      </div>

      {status.status !== 'connected' && (
        <Button 
          onClick={onGenerateQR}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando QR Code...
            </>
          ) : (
            'Gerar QR Code'
          )}
        </Button>
      )}
    </div>
  );
}
