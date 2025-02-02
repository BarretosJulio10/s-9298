import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QRCodeResponse {
  error: boolean;
  message: string;
  connectionKey: string;
  qrcode: string;
}

interface QRCodeGeneratedEvent {
  event: string;
  connectionKey: string;
  qrcode: string;
  moment: string;
  retryCount: string;
}

interface ConnectedInstanceEvent {
  event: string;
  connectionKey: string;
  connectedPhone: string;
  connected: boolean;
  moment: string;
}

const AdminWhatsApp = () => {
  const [qrCode, setQrCode] = useState("");
  const { toast } = useToast();
  const instanceId = "1716319589869x721327290780988000";

  // Função para gerar QR code
  const generateQRCode = async (): Promise<QRCodeResponse> => {
    try {
      const response = await fetch(
        `https://www.w-api.app/manager/create?adm_key=${instanceId}`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": instanceId
          },
          body: JSON.stringify({
            connectionKey: instanceId,
            syncContacts: "enable",
            returnQrcode: "enable"
          })
        }
      );

      if (!response.ok) {
        console.error("Response not OK:", await response.text());
        throw new Error("Falha ao gerar QR Code");
      }

      const data = await response.json();
      console.log("QR Code response:", data);

      if (data.error) {
        throw new Error(data.message || "Falha ao gerar QR Code");
      }

      return data;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  };

  // Mutation para gerar QR code
  const qrCodeMutation = useMutation({
    mutationFn: generateQRCode,
    onSuccess: (data) => {
      setQrCode(data.qrcode);
      toast({
        title: "QR Code gerado com sucesso",
        description: "Escaneie o QR Code com seu WhatsApp",
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: "Não foi possível gerar o QR Code. Tente novamente.",
      });
    },
  });

  const handleConnect = () => {
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
          <Button
            onClick={handleConnect}
            disabled={qrCodeMutation.isPending}
          >
            {qrCodeMutation.isPending ? "Gerando QR Code..." : "Gerar QR Code"}
          </Button>

          {qrCode && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">QR Code</h3>
              <img
                src={qrCode}
                alt="WhatsApp QR Code"
                className="max-w-[300px] border rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWhatsApp;