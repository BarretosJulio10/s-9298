import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function NotificationHistory() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notification-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_history")
        .select("*")
        .eq("type", "whatsapp")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Notificações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
                <span
                  className={`text-sm font-medium ${
                    notification.status === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {notification.status === "success" ? "Enviado" : "Falhou"}
                </span>
              </div>
              <p className="text-sm">{notification.message}</p>
            </div>
          ))}

          {notifications?.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhuma notificação encontrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}