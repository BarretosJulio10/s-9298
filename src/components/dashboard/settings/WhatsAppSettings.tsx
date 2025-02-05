import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";

export function WhatsAppSettings() {
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerateQR = async () => {
    try {
      const data = await callWhatsAppAPI("qrcode");

      if (data.success && data.data?.QRCode) {
        setQrCode(data.data.QRCode);
        toast({
          title: "QR Code gerado com sucesso",
          description: "Escaneie o QR Code com seu WhatsApp",
        });
      } else {
        throw new Error(data.message || "Falha ao gerar QR Code");
      }
    } catch (error) {
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
        setIsConnected(true);
        toast({
          title: "WhatsApp conectado",
          description: "Seu WhatsApp foi conectado com sucesso",
        });
      }
    } catch (error) {
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
        setIsConnected(false);
        setQrCode("");
        toast({
          title: "WhatsApp desconectado",
          description: "Seu WhatsApp foi desconectado com sucesso",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: error instanceof Error ? error.message : "Não foi possível desconectar do WhatsApp",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!config?.whatsapp_instance_id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              WhatsApp instance ID não configurado. Configure-o na seção de configurações.
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