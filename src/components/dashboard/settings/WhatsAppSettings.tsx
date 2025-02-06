
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";

export function WhatsAppSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <WhatsAppStatus />
      </CardContent>
    </Card>
  );
}
