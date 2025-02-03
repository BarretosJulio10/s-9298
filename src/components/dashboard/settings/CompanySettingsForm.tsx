import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { NotificationRulesForm } from "./NotificationRulesForm";
import { PaymentGatewayForm } from "./payment/PaymentGatewayForm";
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
        <PaymentGatewayForm />
        <PaymentMethodSettings />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationRulesForm />
      </TabsContent>
    </Tabs>
  );
}