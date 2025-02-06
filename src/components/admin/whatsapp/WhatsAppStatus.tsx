
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { WhatsAppStatus as IWhatsAppStatus } from "@/types/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewConnectionForm } from "./components/NewConnectionForm";
import { ConnectionDetails } from "./components/ConnectionDetails";
import { QRCodeDisplay } from "./components/QRCodeDisplay";

export function WhatsAppStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<IWhatsAppStatus>({ status: 'disconnected' });
  const { toast } = useToast();

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

  const createInstance = async (connectionName: string) => {
    if (!profile?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Usuário não identificado",
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
        toast({
          title: "Instância criada",
          description: "Instância criada com sucesso! Agora você pode gerar o QR Code.",
        });
      }
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
        
        toast({
          title: "QR Code gerado",
          description: "Escaneie o QR Code para conectar seu WhatsApp",
        });
      }
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

  useEffect(() => {
    if (connection && connection.instance_key) {
      setStatus({ 
        status: connection.is_connected ? 'connected' : 'disconnected',
        instanceKey: connection.instance_key 
      });
      if (connection.last_qr_code) {
        setQrCode(connection.last_qr_code);
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
          <NewConnectionForm
            onCreateInstance={createInstance}
            isLoading={isLoading}
          />
        )}

        {connection?.instance_key && (
          <ConnectionDetails
            connection={connection}
            status={status}
            onGenerateQR={generateQR}
            isLoading={isLoading}
          />
        )}

        {qrCode && status.status === 'connecting' && (
          <QRCodeDisplay qrCode={qrCode} />
        )}
      </CardContent>
    </Card>
  );
}
