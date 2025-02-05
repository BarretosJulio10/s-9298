import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChargeSettingsForm } from "@/components/admin/settings/ChargeSettingsForm";
import { NotificationRulesForm } from "./NotificationRulesForm";
import { PaymentSettings } from "@/components/admin/settings/payment/PaymentSettings";
import { Routes, Route } from "react-router-dom";
import { MercadoPagoGatewayForm } from "@/components/admin/settings/payment/gateways/MercadoPagoGatewayForm";
import { AsaasGatewayForm } from "@/components/admin/settings/payment/gateways/AsaasGatewayForm";
import { PagHiperGatewayForm } from "@/components/admin/settings/payment/gateways/PagHiperGatewayForm";
import { PaymentGatewayList } from "@/components/admin/settings/payment/PaymentGatewayList";
import { WhatsAppSettings } from "./WhatsAppSettings";

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
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>
            <TabsContent value="payment" className="space-y-6">
              <PaymentGatewayList />
            </TabsContent>
            <TabsContent value="charge">
              <ChargeSettingsForm />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationRulesForm />
            </TabsContent>
            <TabsContent value="whatsapp">
              <WhatsAppSettings />
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