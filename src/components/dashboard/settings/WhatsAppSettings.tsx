
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WhatsAppSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Funcionalidade de WhatsApp não disponível.
        </p>
      </CardContent>
    </Card>
  );
}
