
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { Loader2 } from "lucide-react";
import { WhatsAppStatus as IWhatsAppStatus } from "@/types/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<IWhatsAppStatus>({ status: 'disconnected' });
  const [connectionName, setConnectionName] = useState('');
  const { toast } = useToast();

  // Buscar o profile do usuário logado
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Buscar conexão existente
  const { data: connection, refetch: refetchConnection } = useQuery({
    queryKey: ["whatsapp-connection", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("company_id", profile?.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const createInstance = async () => {
    if (!profile?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Usuário não identificado",
      });
      return;
    }

    if (!connectionName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite um nome para a conexão",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await callWhatsAppAPI("createInstance", {
        companyId: profile.id,
        name: connectionName
      });
      
      if (response.success && response.data?.instance?.key) {
        setStatus({ status: 'connecting', instanceKey: response.data.instance.key });
        await refetchConnection();
      }
      
      toast({
        title: "Instância criada",
        description: "Instância criada com sucesso",
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

  const generateQR = async () => {
    if (!connection?.instance_key) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nenhuma instância encontrada",
      });
      return;
    }

    try {
      setIsLoading(true);
      const qrResponse = await callWhatsAppAPI("generateQRCode", {
        instanceKey: connection.instance_key
      });
      
      if (qrResponse.success && qrResponse.data?.qrcode) {
        setQrCode(qrResponse.data.qrcode);
        checkConnectionStatus(connection.instance_key);
        await refetchConnection();
      }
      
      toast({
        title: "QR Code gerado",
        description: "Escaneie o QR Code para conectar seu WhatsApp",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
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
          setStatus({ status: 'connected', instanceKey: key });
          setQrCode(null);
          await refetchConnection();
          toast({
            title: "WhatsApp conectado",
            description: "Seu WhatsApp foi conectado com sucesso!",
          });
        } else if (status.status === 'connecting') {
          setTimeout(() => checkConnectionStatus(key), 5000);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    }
  };

  // Se já existe uma conexão, verificar o status
  useEffect(() => {
    if (connection && connection.instance_key) {
      setStatus({ 
        status: connection.is_connected ? 'connected' : 'disconnected',
        instanceKey: connection.instance_key 
      });
      if (connection.last_qr_code) {
        setQrCode(connection.last_qr_code);
      }
      if (connection.name) {
        setConnectionName(connection.name);
      }
    }
  }, [connection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexão do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connection?.instance_key && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Input
                placeholder="Nome da conexão"
                value={connectionName}
                onChange={(e) => setConnectionName(e.target.value)}
              />
            </div>
            <Button 
              onClick={createInstance}
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
          </div>
        )}

        {connection?.instance_key && (
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
                onClick={generateQR}
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
        )}

        {qrCode && status.status === 'connecting' && (
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

