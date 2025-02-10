
import { useState, useEffect } from "react";
import { useWapiInstances } from "@/hooks/useWapiInstances";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, QrCode, Plus, RefreshCw, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
        <div className="flex gap-4">
          <Input
            placeholder="Nome da instância"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
          />
          <Button onClick={handleCreateInstance} disabled={isCreating || !instanceName}>
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Instância
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : instances && instances.length > 0 ? (
            instances.map((instance) => (
              <Card key={instance.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{instance.name}</h3>
                      <Badge
                        variant={
                          instance.status === "connected"
                            ? "success"
                            : instance.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {instance.status === "connected"
                          ? "Conectado"
                          : instance.status === "pending"
                          ? "Pendente"
                          : "Desconectado"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshStatus(instance.id)}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                      {instance.status !== "connected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowQR(instance.id)}
                          disabled={isGettingQR}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      )}
                      {instance.status === "connected" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(instance.id)}
                          disabled={isDisconnecting}
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma instância configurada.
            </p>
          )}
        </div>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conectar WhatsApp</DialogTitle>
              <DialogDescription>
                Escaneie o QR Code abaixo com seu WhatsApp para conectar
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Abra o WhatsApp no seu celular e escaneie o QR Code para conectar
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
