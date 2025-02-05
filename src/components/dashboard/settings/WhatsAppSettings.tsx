import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function WhatsAppSettings() {
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleGenerateQR = async () => {
    try {
      const data = await callWhatsAppAPI("qrcode");

      if (data.status === "success" && data.data?.QRCode) {
        setQrCode(data.data.QRCode);
        toast({
          title: "QR Code gerado com sucesso",
          description: "Escaneie o QR Code com seu WhatsApp",
        });
      } else {
        throw new Error(data.message || "Falha ao gerar QR Code");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar QR Code",
        description: error instanceof Error ? error.message : "Não foi possível gerar o QR Code",
      });
    }
  };

  const handleConfigureWebhook = async () => {
    if (!webhookUrl) {
      toast({
        variant: "destructive",
        title: "URL do Webhook necessária",
        description: "Por favor, insira a URL do webhook",
      });
      return;
    }

    try {
      const data = await callWhatsAppAPI("configureWebhook", { webhookUrl });

      if (data.success) {
        toast({
          title: "Webhook configurado com sucesso",
          description: "O webhook foi configurado e começará a receber eventos",
        });
      } else {
        throw new Error(data.message || "Falha ao configurar webhook");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao configurar webhook",
        description: error instanceof Error ? error.message : "Não foi possível configurar o webhook",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!config?.whatsapp_instance_id && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              WhatsApp instance ID não configurado. Configure-o na seção de configurações.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {!isConnected && !qrCode && config?.whatsapp_instance_id && (
            <Button onClick={handleGenerateQR}>
              Gerar QR Code
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="webhook" className="text-sm font-medium">URL do Webhook</label>
          <div className="flex gap-2">
            <Input
              id="webhook"
              placeholder="https://seu-webhook.com/whatsapp"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <Button onClick={handleConfigureWebhook}>
              Configurar Webhook
            </Button>
          </div>
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
      </CardContent>
    </Card>
  );
}