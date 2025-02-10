
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, RefreshCw, LogOut } from "lucide-react";
import { WapiInstance } from "@/lib/wapi/types";

interface InstanceListProps {
  instances: WapiInstance[] | undefined;
  isLoading: boolean;
  isRefreshing: boolean;
  isGettingQR: boolean;
  isDisconnecting: boolean;
  onRefreshStatus: (id: string) => void;
  onShowQR: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function InstanceList({
  instances,
  isLoading,
  isRefreshing,
  isGettingQR,
  isDisconnecting,
  onRefreshStatus,
  onShowQR,
  onDisconnect
}: InstanceListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!instances || instances.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        Nenhuma instância configurada.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {instances.map((instance) => (
        <Card key={instance.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{instance.name}</h3>
                <Badge
                  variant={
                    instance.status === "connected"
                      ? "success"
                      : instance.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {instance.status === "connected"
                    ? "Conectado"
                    : instance.status === "pending"
                    ? "Pendente"
                    : "Desconectado"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefreshStatus(instance.id)}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                {instance.status !== "connected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShowQR(instance.id)}
                    disabled={isGettingQR}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                )}
                {instance.status === "connected" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDisconnect(instance.id)}
                    disabled={isDisconnecting}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
