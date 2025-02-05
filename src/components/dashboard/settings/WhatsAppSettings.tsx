import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppSettings() {
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Buscar configurações do admin e status da conexão
  const { data: adminConfig } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("whatsapp_instance_id")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Buscar status da conexão do WhatsApp
  const { data: whatsappConnection } = useQuery({
    queryKey: ["whatsapp-connection"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerateQR = async () => {
    try {
      if (!adminConfig?.whatsapp_instance_id) {
        throw new Error("ID da instância do WhatsApp não configurado no painel admin");
      }

      const data = await callWhatsAppAPI("qrcode");

      if (data.success && data.data?.QRCode) {
        // Atualizar o QR code no banco
        const { error: updateError } = await supabase
          .from("whatsapp_connections")
          .upsert({
            company_id: (await supabase.auth.getUser()).data.user?.id,
            last_qr_code: data.data.QRCode,
            is_connected: false,
          });

        if (updateError) throw updateError;

        setQrCode(data.data.QRCode);
        toast({
          title: "QR Code gerado com sucesso",
          description: "Escaneie o QR Code com seu WhatsApp",
        });
      } else {
        throw new Error(data.message || "Falha ao gerar QR Code");
      }
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error instanceof Error ? error.message : "Não foi possível gerar o QR Code",
      });
    }
  };

  const handleConnect = async () => {
    try {
      const data = await callWhatsAppAPI("connect");
      if (data.success) {
        // Atualizar status da conexão no banco
        const { error: updateError } = await supabase
          .from("whatsapp_connections")
          .upsert({
            company_id: (await supabase.auth.getUser()).data.user?.id,
            is_connected: true,
            last_connection_date: new Date().toISOString(),
          });

        if (updateError) throw updateError;

        setIsConnected(true);
        toast({
          title: "WhatsApp conectado",
          description: "Seu WhatsApp foi conectado com sucesso",
        });
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
      toast({
        variant: "destructive",
        title: "Erro ao conectar",
        description: error instanceof Error ? error.message : "Não foi possível conectar ao WhatsApp",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const data = await callWhatsAppAPI("disconnect");
      if (data.success) {
        // Atualizar status da conexão no banco
        const { error: updateError } = await supabase
          .from("whatsapp_connections")
          .upsert({
            company_id: (await supabase.auth.getUser()).data.user?.id,
            is_connected: false,
            last_qr_code: null,
          });

        if (updateError) throw updateError;

        setIsConnected(false);
        setQrCode("");
        toast({
          title: "WhatsApp desconectado",
          description: "Seu WhatsApp foi desconectado com sucesso",
        });
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: error instanceof Error ? error.message : "Não foi possível desconectar do WhatsApp",
      });
    }
  };

  // Atualizar estado local com dados do banco
  useState(() => {
    if (whatsappConnection) {
      setIsConnected(whatsappConnection.is_connected);
      setQrCode(whatsappConnection.last_qr_code || "");
    }
  }, [whatsappConnection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!adminConfig?.whatsapp_instance_id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ID da instância do WhatsApp não configurado no painel admin.
            </AlertDescription>
          </Alert>
        )}

        <WhatsAppStatus
          isConnected={isConnected}
          qrCode={qrCode}
          onGenerateQR={handleGenerateQR}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </CardContent>
    </Card>
  );
}