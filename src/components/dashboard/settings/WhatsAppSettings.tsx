
import { useState } from "react";
import { useWapiInstances } from "@/hooks/useWapiInstances";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, QrCode, Plus, RefreshCw, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function WhatsAppSettings() {
  const [instanceName, setInstanceName] = useState("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
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

  const handleCreateInstance = async () => {
    if (!instanceName) return;
    await createInstance(instanceName);
    setInstanceName("");
  };

  const handleShowQR = async (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setShowQRDialog(true);
    const qr = await getQRCode(instanceId);
    if (qr) {
      setQrCode(qr);
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
                        <RefreshCw className="h-4 w-4" />
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
                          onClick={() => disconnectInstance(instance.id)}
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
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              {qrCode ? (
                <img
                  src={`data:image/png;base64,${qrCode}`}
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
