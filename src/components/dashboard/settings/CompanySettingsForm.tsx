import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChargeSettingsForm } from "./ChargeSettingsForm";
import { NotificationRulesForm } from "./NotificationRulesForm";

export function CompanySettingsForm() {
  return (
    <Tabs defaultValue="charge" className="space-y-6">
      <TabsList>
        <TabsTrigger value="charge">Cobranças</TabsTrigger>
        <TabsTrigger value="notifications">Notificações</TabsTrigger>
      </TabsList>
      <TabsContent value="charge">
        <ChargeSettingsForm />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationRulesForm />
      </TabsContent>
    </Tabs>
  );
}