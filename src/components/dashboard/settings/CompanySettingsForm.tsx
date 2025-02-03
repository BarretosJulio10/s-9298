import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { NotificationRulesForm } from "./NotificationRulesForm";
import { AsaasGatewayForm } from "./payment/gateways/AsaasGatewayForm";
import { MercadoPagoGatewayForm } from "./payment/gateways/MercadoPagoGatewayForm";
import { PaymentMethodSettings } from "./payment/PaymentMethodSettings";

export function CompanySettingsForm() {
  return (
    <Tabs defaultValue="charge" className="space-y-6">
      <TabsList>
        <TabsTrigger value="charge">Cobranças</TabsTrigger>
        <TabsTrigger value="payment">Pagamentos</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="charge">
        <ChargeSettingsForm />
      </TabsContent>
      <TabsContent value="payment" className="space-y-6">
        <AsaasGatewayForm />
        <MercadoPagoGatewayForm />
        <PaymentMethodSettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationRulesForm />
      </TabsContent>
    </Tabs>
  );
}