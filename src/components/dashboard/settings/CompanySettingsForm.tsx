import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { NotificationRulesForm } from "./NotificationRulesForm";
import { PaymentSettings } from "@/components/admin/settings/payment/PaymentSettings";
import { Routes, Route } from "react-router-dom";
import { MercadoPagoGatewayForm } from "./payment/gateways/MercadoPagoGatewayForm";
import { AsaasGatewayForm } from "./payment/gateways/AsaasGatewayForm";
import { PagHiperGatewayForm } from "./payment/gateways/PagHiperGatewayForm";

export function CompanySettingsForm() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Tabs defaultValue="payment" className="space-y-6">
            <TabsList>
              <TabsTrigger value="payment">Pagamentos</TabsTrigger>
              <TabsTrigger value="charge">Cobranças</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="payment" className="space-y-6">
              <PaymentSettings />
            </TabsContent>
            <TabsContent value="charge">
              <ChargeSettingsForm />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationRulesForm />
            </TabsContent>
          </Tabs>
        }
      />
      <Route path="/payment/mercadopago" element={<MercadoPagoGatewayForm />} />
      <Route path="/payment/asaas" element={<AsaasGatewayForm />} />
      <Route path="/payment/paghiper" element={<PagHiperGatewayForm />} />
    </Routes>
  );
}