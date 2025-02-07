
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { WhatsAppStatus } from "@/types/whatsapp";

export function useWhatsAppInstance(onConnectionChange: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<WhatsAppStatus>({ status: 'disconnected' });
  const { toast } = useToast();

  const createInstance = async (profileId: string, connectionName: string) => {
    if (!profileId) {
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
        companyId: profileId,
        name: connectionName
      });
      
      if (response.success && response.data?.instance?.key) {
        setStatus({ status: 'connecting', instanceKey: response.data.instance.key });
        await onConnectionChange();
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

  const generateQR = async (instanceKey: string) => {
    if (!instanceKey) {
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
        instanceKey: instanceKey
      });
      
      if (qrResponse.success && qrResponse.data?.qrcode) {
        setQrCode(qrResponse.data.qrcode);
        checkConnectionStatus(instanceKey);
        await onConnectionChange();
        
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

  const disconnect = async (instanceKey: string) => {
    if (!instanceKey) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nenhuma instância encontrada",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await callWhatsAppAPI("disconnectInstance", {
        instanceKey: instanceKey
      });
      
      if (response.success) {
        setStatus({ status: 'disconnected' });
        setQrCode(null);
        await onConnectionChange();
        
        toast({
          title: "WhatsApp desconectado",
          description: "Seu WhatsApp foi desconectado com sucesso!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao desconectar WhatsApp",
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
          await onConnectionChange();
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

  return {
    isLoading,
    qrCode,
    status,
    setStatus,
    setQrCode,
    createInstance,
    generateQR,
    disconnect,
    checkConnectionStatus,
  };
}
