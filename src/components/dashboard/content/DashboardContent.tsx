import DashboardHome from "@/pages/dashboard/DashboardHome";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { CompanySettingsForm } from "@/components/dashboard/settings/CompanySettingsForm";
import { PaymentGatewayForm } from "@/components/dashboard/settings/payment/PaymentGatewayForm";
import { TemplateForm } from "@/components/dashboard/templates/TemplateForm";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
import { ClientsList } from "@/components/dashboard/clients/ClientsList";
import { ClientForm } from "@/components/dashboard/clients/ClientForm";

interface DashboardContentProps {
  showTemplateForm: boolean;
  showChargeForm: boolean;
  onBack: () => void;
  activeSection: string;
}

export function DashboardContent({
  showTemplateForm,
  showChargeForm,
  onBack,
  activeSection,
}: DashboardContentProps) {
  if (activeSection === "home") {
    return (
      <DashboardHome
        showTemplateForm={showTemplateForm}
        showChargeForm={showChargeForm}
        onBack={onBack}
        activeSection="home"
      />
    );
  }

  if (activeSection === "clients") {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <ClientsList />
      </div>
    );
  }

  if (activeSection === "settings") {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Configurações</h2>
        
        <div className="grid gap-8">
          <CompanySettingsForm />
          <PaymentGatewayForm />
        </div>
      </div>
    );
  }

  if (activeSection === "templates") {
    if (showTemplateForm) {
      return <TemplateForm onBack={onBack} />;
    }
    return <TemplatesList />;
  }

  if (activeSection === "charges") {
    return <CompanyCharges />;
  }

  return null;
}