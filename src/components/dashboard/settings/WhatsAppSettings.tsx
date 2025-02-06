
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppStatus } from "@/components/admin/whatsapp/WhatsAppStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function WhatsAppSettings() {
  const { toast } = useToast();

  // Buscar configurações do admin
  const { data: config, isLoading: isLoadingConfig } = useQuery({
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
      <Card>
        <CardHeader>
          <CardTitle>Configurações do WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Token da W-API não configurado no painel admin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
