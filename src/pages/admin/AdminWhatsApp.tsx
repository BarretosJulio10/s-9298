import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QRCodeResponse {
  status: string;
  qrcode?: string;
  message?: string;
}

interface StatusResponse {
  status: string;
  message: string;
  connected: boolean;
}

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

  // Função para verificar status
  const checkStatus = async () => {
    if (!config?.whatsapp_instance_id) {
      throw new Error("ID da instância do WhatsApp não configurado");
    }

    const response = await fetch(
      `https://www.w-api.app/session/status`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Token": config.whatsapp_instance_id
        }
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao verificar status");
    }

    const data = await response.json();
    return data;
  };

  // Query para verificar status periodicamente
  const { data: statusData } = useQuery({
    queryKey: ["whatsapp-status", config?.whatsapp_instance_id],
    queryFn: checkStatus,
    enabled: !!config?.whatsapp_instance_id,
    refetchInterval: 10000,
  });

  // Atualiza o estado de conexão baseado no status
  useEffect(() => {
    if (statusData?.data?.Connected && statusData?.data?.LoggedIn) {
      setIsConnected(true);
      setQrCode(""); // Limpa o QR code quando conectado
    } else {
      setIsConnected(false);
    }
  }, [statusData]);

  // Mutation para gerar QR code
  const qrCodeMutation = useMutation({
    mutationFn: async () => {
      if (!config?.whatsapp_instance_id) {
        throw new Error("ID da instância do WhatsApp não configurado");
      }

      const response = await fetch(
        `https://www.w-api.app/session/qr`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Token": config.whatsapp_instance_id
          }
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao gerar QR Code");
      }

      const data: QRCodeResponse = await response.json();
      
      if (data.status === "erro" && data.message === "connected") {
        throw new Error("WhatsApp já está conectado");
      }
      
      if (data.status === "success" && data.qrcode) {
        return data.qrcode;
      } else {
        throw new Error("Falha ao gerar QR Code");
      }
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
        description: error instanceof Error ? error.message : "Não foi possível gerar o QR Code. Tente novamente.",
      });
    },
  });

  // Mutation para conectar WhatsApp
  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!config?.whatsapp_instance_id) {
        throw new Error("ID da instância do WhatsApp não configurado");
      }

      const response = await fetch(
        `https://www.w-api.app/session/connect`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Token": config.whatsapp_instance_id,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "Subscribe": ["Message"],
            "Immediate": false
          })
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao conectar WhatsApp");
      }

      const data = await response.json();
      return data;
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
        description: error instanceof Error ? error.message : "Não foi possível conectar o WhatsApp. Tente novamente.",
      });
    },
  });

  // Mutation para desconectar
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!config?.whatsapp_instance_id) {
        throw new Error("ID da instância do WhatsApp não configurado");
      }

      const response = await fetch(
        `https://www.w-api.app/session/logout`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Token": config.whatsapp_instance_id
          }
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao desconectar");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error("Falha ao desconectar");
      }
    },
    onSuccess: () => {
      setQrCode("");
      setIsConnected(false);
      toast({
        title: "WhatsApp desconectado",
        description: "A conexão foi encerrada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: error instanceof Error ? error.message : "Não foi possível desconectar. Tente novamente.",
      });
    },
  });

  const handleConnect = () => {
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  const handleGenerateQR = () => {
    qrCodeMutation.mutate();
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