import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentMethodSectionProps {
  title: string;
  icon: React.ReactNode;
  gateways: Array<{
    id: string;
    gateway: string;
    enabled: boolean;
    is_default: boolean;
  }>;
  method: "pix" | "credit_card" | "boleto";
  onSelect: (gatewayId: string) => void;
}

export function PaymentMethodSection({ 
  title, 
  icon, 
  gateways,
  method,
  onSelect 
}: PaymentMethodSectionProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title} {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                gateway.is_default ? "border-primary bg-primary/5" : "hover:border-primary"
              }`}
              onClick={() => onSelect(gateway.id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {gateway.gateway === "mercadopago"
                    ? "Mercado Pago"
                    : gateway.gateway === "asaas"
                    ? "ASAAS"
                    : gateway.gateway === "paghiper"
                    ? "PagHiper"
                    : gateway.gateway === "picpay"
                    ? "PicPay"
                    : "PagBank"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/settings/payment/${gateway.gateway}`);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {gateway.enabled ? "Ativo" : "Inativo"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}