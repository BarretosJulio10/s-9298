
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWhatsAppInstance } from "./hooks/useWhatsAppInstance";
import { useCompanyProfile } from "./hooks/useCompanyProfile";
import { useWhatsAppConnection } from "./hooks/useWhatsAppConnection";
import { NewConnectionForm } from "./components/NewConnectionForm";
import { ConnectionDetails } from "./components/ConnectionDetails";
import { QRCodeDisplay } from "./components/QRCodeDisplay";

export function WhatsAppStatus() {
  const { data: profile } = useCompanyProfile();
  const { data: connection, refetch: refetchConnection } = useWhatsAppConnection(profile?.id);
  
  const {
    isLoading,
    qrCode,
    status,
    setStatus,
    setQrCode,
    createInstance,
    generateQR,
    disconnect,
  } = useWhatsAppInstance(refetchConnection);

  const handleCreateInstance = async (connectionName: string) => {
    if (profile?.id) {
      await createInstance(profile.id, connectionName);
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
            onCreateInstance={handleCreateInstance}
            isLoading={isLoading}
          />
        )}

        {connection?.instance_key && (
          <ConnectionDetails
            connection={connection}
            status={status}
            onGenerateQR={() => generateQR(connection.instance_key!)}
            onDisconnect={() => disconnect(connection.instance_key!)}
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
