
import { Card } from "@/components/ui/card";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";
import { WhatsAppMessage } from "@/components/admin/whatsapp/WhatsAppMessage";
import { NotificationHistory } from "@/components/admin/whatsapp/NotificationHistory";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminWhatsApp = () => {
  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("wapi_token")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (!config?.wapi_token) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
          <p className="text-destructive">
            Token da W-API não configurado. Configure-o na seção de configurações.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">WhatsApp</h2>
        <p className="text-muted-foreground">
          Gerencie a conexão com o WhatsApp e envie mensagens
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WhatsAppStatus />
        <WhatsAppMessage />
      </div>

      <NotificationHistory />
    </div>
  );
};

export default AdminWhatsApp;
