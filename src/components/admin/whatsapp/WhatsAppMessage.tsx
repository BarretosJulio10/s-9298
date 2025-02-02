import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";

export function WhatsAppMessage({ isConnected }: { isConnected: boolean }) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!phone || !message) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Preencha todos os campos",
      });
      return;
    }

    try {
      setSending(true);
      await callWhatsAppAPI("sendMessage", { phone, message });
      toast({
        title: "Mensagem enviada",
        description: "A mensagem foi enviada com sucesso",
      });
      setPhone("");
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Mensagem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone">Telefone</label>
          <Input
            id="phone"
            placeholder="Ex: 5511999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isConnected}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message">Mensagem</label>
          <Textarea
            id="message"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
          />
        </div>

        <Button 
          onClick={handleSendMessage} 
          disabled={!isConnected || sending}
        >
          {sending ? "Enviando..." : "Enviar Mensagem"}
        </Button>
      </CardContent>
    </Card>
  );
}