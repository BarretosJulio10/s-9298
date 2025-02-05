import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { Loader2 } from "lucide-react";

export function WhatsAppStatus({ 
  isConnected, 
  qrCode,
  onGenerateQR,
  onConnect,
  onDisconnect 
}: {
  isConnected: boolean;
  qrCode: string;
  onGenerateQR: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {!isConnected && !qrCode && (
            <Button 
              onClick={onGenerateQR}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar QR Code'
              )}
            </Button>
          )}

          {qrCode && !isConnected && (
            <Button 
              onClick={onConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar WhatsApp'
              )}
            </Button>
          )}

          {isConnected && (
            <Button
              variant="destructive"
              onClick={onDisconnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Desconectando...
                </>
              ) : (
                'Desconectar'
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {qrCode && !isConnected && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Escaneie o QR Code com seu WhatsApp para conectar
            </p>
            <img
              src={qrCode}
              alt="WhatsApp QR Code"
              className="max-w-[300px] border rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}