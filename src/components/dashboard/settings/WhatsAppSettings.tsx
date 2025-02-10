
import { useState, useEffect } from "react";
import { useWapiInstances } from "@/hooks/useWapiInstances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreateInstanceForm } from "./whatsapp/CreateInstanceForm";
import { InstanceList } from "./whatsapp/InstanceList";
import { QRCodeDialog } from "./whatsapp/QRCodeDialog";

export function WhatsAppSettings() {
  const [instanceName, setInstanceName] = useState("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { toast } = useToast();
  const {
    instances,
    isLoading,
    createInstance,
    disconnectInstance,
    refreshStatus,
    getQRCode,
    isCreating,
    isDisconnecting,
    isRefreshing,
    isGettingQR
  } = useWapiInstances();

  // Efeito para verificar o status da conexão periodicamente quando o QR code está sendo exibido
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showQRDialog && selectedInstanceId) {
      intervalId = setInterval(async () => {
        const instance = instances?.find(i => i.id === selectedInstanceId);
        if (instance) {
          await refreshStatus(selectedInstanceId);
          
          // Se a instância estiver conectada, fecha o modal
          if (instance.status === "connected") {
            setShowQRDialog(false);
            setQrCode(null);
            toast({
              title: "Sucesso",
              description: "WhatsApp conectado com sucesso!",
            });
            clearInterval(intervalId);
          }
        }
      }, 3000); // Verifica a cada 3 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showQRDialog, selectedInstanceId, instances, refreshStatus, toast]);

  const handleCreateInstance = async () => {
    if (!instanceName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da instância é obrigatório",
      });
      return;
    }
    try {
      await createInstance(instanceName);
      setInstanceName("");
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar instância. Tente novamente.",
      });
    }
  };

  const handleShowQR = async (instanceId: string) => {
    try {
      setSelectedInstanceId(instanceId);
      setShowQRDialog(true);
      setQrCode(null); // Reset QR code while loading
      
      const qrCodeData = await getQRCode(instanceId);
      console.log('QR Code recebido:', qrCodeData); // Debug
      setQrCode(qrCodeData);
      
      if (!qrCodeData) {
        throw new Error("Não foi possível gerar o QR code. Verifique se a instância está conectada ao WhatsApp.");
      }
    } catch (error) {
      console.error("Erro ao obter QR code:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível gerar o QR code. Tente novamente.",
      });
      setShowQRDialog(false);
    }
  };

  const handleDisconnect = async (instanceId: string) => {
    try {
      await disconnectInstance(instanceId);
      toast({
        title: "Sucesso",
        description: "Instância desconectada com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao desconectar instância. Tente novamente.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateInstanceForm
          instanceName={instanceName}
          onInstanceNameChange={setInstanceName}
          onCreateInstance={handleCreateInstance}
          isCreating={isCreating}
        />

        <InstanceList
          instances={instances}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          isGettingQR={isGettingQR}
          isDisconnecting={isDisconnecting}
          onRefreshStatus={refreshStatus}
          onShowQR={handleShowQR}
          onDisconnect={handleDisconnect}
        />

        <QRCodeDialog
          open={showQRDialog}
          onOpenChange={setShowQRDialog}
          qrCode={qrCode}
        />
      </CardContent>
    </Card>
  );
}
