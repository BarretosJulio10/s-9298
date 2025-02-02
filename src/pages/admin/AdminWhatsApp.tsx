import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";
import { WhatsAppMessage } from "@/components/admin/whatsapp/WhatsAppMessage";
import { NotificationHistory } from "@/components/admin/whatsapp/NotificationHistory";

const AdminWhatsApp = () => {
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // Fetch configurations from Supabase
  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Check WhatsApp connection status
  const { data: statusData } = useQuery({
    queryKey: ["whatsapp-status", config?.whatsapp_instance_id],
    queryFn: async () => {
      return callWhatsAppAPI("status");
    },
    enabled: !!config?.whatsapp_instance_id,
    refetchInterval: 10000,
  });

  // Update connection status based on API response
  useEffect(() => {
    if (statusData?.data?.Connected && statusData?.data?.LoggedIn) {
      setIsConnected(true);
      setQrCode("");
    } else {
      setIsConnected(false);
    }
  }, [statusData]);

  // Generate QR code
  const qrCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await callWhatsAppAPI("qrcode");
      if (response.status === "erro" && response.message === "connected") {
        throw new Error("WhatsApp já está conectado");
      }
      if (response.status === "success" && response.data?.QRCode) {
        return response.data.QRCode;
      }
      throw new Error("Falha ao gerar QR Code");
    },
    onSuccess: (qrcode) => {
      setQrCode(qrcode);
      toast({
        title: "QR Code gerado com sucesso",
        description: "Escaneie o QR Code com seu WhatsApp",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error instanceof Error ? error.message : "Não foi possível gerar o QR Code",
      });
    },
  });

  // Connect WhatsApp
  const connectMutation = useMutation({
    mutationFn: async () => {
      return callWhatsAppAPI("connect");
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp conectado",
        description: "Conexão estabelecida com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao conectar WhatsApp",
        description: error instanceof Error ? error.message : "Não foi possível conectar",
      });
    },
  });

  // Disconnect WhatsApp
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return callWhatsAppAPI("disconnect");
    },
    onSuccess: () => {
      setQrCode("");
      setIsConnected(false);
      toast({
        title: "WhatsApp desconectado",
        description: "Conexão encerrada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: error instanceof Error ? error.message : "Não foi possível desconectar",
      });
    },
  });

  if (!config?.whatsapp_instance_id) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
          <p className="text-destructive">
            ID da instância do WhatsApp não configurado. Configure-o na seção de configurações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
        <p className="text-muted-foreground">
          Gerencie a conexão com o WhatsApp e envie mensagens
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WhatsAppStatus
          isConnected={isConnected}
          qrCode={qrCode}
          onGenerateQR={() => qrCodeMutation.mutate()}
          onConnect={() => connectMutation.mutate()}
          onDisconnect={() => disconnectMutation.mutate()}
        />
        <WhatsAppMessage isConnected={isConnected} />
      </div>

      <NotificationHistory />
    </div>
  );
};

export default AdminWhatsApp;