
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { Loader2 } from "lucide-react";

export function WhatsAppStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceKey, setInstanceKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const { toast } = useToast();

  const createInstance = async () => {
    try {
      setIsLoading(true);
      const response = await callWhatsAppAPI("createInstance");
      
      if (response.success && response.data?.instance?.key) {
        setInstanceKey(response.data.instance.key);
        const qrResponse = await callWhatsAppAPI("generateQRCode", {
          instanceKey: response.data.instance.key
        });
        
        if (qrResponse.success && qrResponse.data?.qrcode) {
          setQrCode(qrResponse.data.qrcode);
          setStatus('connecting');
          
          // Iniciar verificação de status
          checkConnectionStatus(response.data.instance.key);
        }
      }
      
      toast({
        title: "Instância criada",
        description: "Escaneie o QR Code para conectar seu WhatsApp",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar instância",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionStatus = async (key: string) => {
    try {
      const response = await callWhatsAppAPI("getInstanceStatus", { instanceKey: key });
      
      if (response.success) {
        if (response.data?.status === 'connected') {
          setStatus('connected');
          setQrCode(null);
          toast({
            title: "WhatsApp conectado",
            description: "Seu WhatsApp foi conectado com sucesso!",
          });
        } else if (status === 'connecting') {
          // Continuar verificando o status a cada 5 segundos
          setTimeout(() => checkConnectionStatus(key), 5000);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexão do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {status === 'disconnected' && (
            <Button 
              onClick={createInstance}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando instância...
                </>
              ) : (
                'Conectar WhatsApp'
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {status === 'connected' ? 'Conectado' : status === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </span>
        </div>

        {qrCode && status === 'connecting' && (
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
