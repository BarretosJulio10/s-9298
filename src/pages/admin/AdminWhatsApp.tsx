import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminWhatsApp = () => {
  const [apiKey, setApiKey] = useState("");
  const [qrCode, setQrCode] = useState("");
  const { toast } = useToast();

  // Função para gerar QR code
  const generateQRCode = async () => {
    try {
      const response = await fetch("https://api.w-api.app/v2/instance/qrcode", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar QR Code");
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: "Verifique sua chave API e tente novamente",
      });
    },
  });

  const handleConnect = () => {
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Chave API necessária",
        description: "Por favor, insira sua chave API do W-API",
      });
      return;
    }
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
          <div className="space-y-2">
            <label htmlFor="apiKey">Chave API</label>
            <Input
              id="apiKey"
              placeholder="Insira sua chave API do W-API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

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