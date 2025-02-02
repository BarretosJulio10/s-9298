import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { callWhatsAppAPI } from "@/lib/whatsapp";

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

  const handleGenerateQR = () => {
    qrCodeMutation.mutate();
  };

  const handleConnect = () => {
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
          <p className="text-muted-foreground">
            Conecte seu WhatsApp escaneando o QR Code
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!config?.whatsapp_instance_id ? (
            <p className="text-destructive">
              ID da instância do WhatsApp não configurado. Configure-o na seção de configurações.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGenerateQR}
                  disabled={qrCodeMutation.isPending || isConnected}
                >
                  {qrCodeMutation.isPending ? "Gerando QR Code..." : "Gerar QR Code"}
                </Button>

                {qrCode && !isConnected && (
                  <Button
                    onClick={handleConnect}
                    disabled={connectMutation.isPending}
                  >
                    {connectMutation.isPending ? "Conectando..." : "Conectar WhatsApp"}
                  </Button>
                )}

                {isConnected && (
                  <Button
                    variant="destructive"
                    onClick={handleDisconnect}
                    disabled={disconnectMutation.isPending}
                  >
                    {disconnectMutation.isPending ? "Desconectando..." : "Desconectar"}
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
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="max-w-[300px] border rounded-lg"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWhatsApp;