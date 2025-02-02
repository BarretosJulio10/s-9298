import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminWhatsApp = () => {
  const [apiKey, setApiKey] = useState("");
  const [qrCode, setQrCode] = useState("");
  const { toast } = useToast();

  // Função para iniciar a sessão e gerar QR code
  const startSession = async () => {
    try {
      const response = await fetch("https://api.wapi.com/v2/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao iniciar sessão");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Mutation para iniciar sessão
  const sessionMutation = useMutation({
    mutationFn: startSession,
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
    sessionMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
        <p className="text-muted-foreground">
          Gerencie sua conexão com o WhatsApp
        </p>
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
            disabled={sessionMutation.isPending}
          >
            {sessionMutation.isPending ? "Conectando..." : "Conectar WhatsApp"}
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