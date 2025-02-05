import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface DashboardContentProps {
  showChargeForm: boolean;
  onBack: () => void;
  activeSection: string;
}

const sectionTitles: Record<string, string> = {
  home: "Dashboard",
  clients: "Clientes",
  wallet: "Carteira",
  charges: "Cobranças",
  templates: "Templates",
  settings: "Configurações"
};

export function DashboardContent({ 
  showChargeForm, 
  onBack,
  activeSection 
}: DashboardContentProps) {
  const { session } = useAuth();

  const renderHeader = () => {
    const title = sectionTitles[activeSection] || "Dashboard";
    return (
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {activeSection === 'home' ? 'Bem-vindo ao seu painel de controle' : `Gerencie seus ${title.toLowerCase()} aqui`}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (showChargeForm) {
      return (
        <div className="mt-6">
          <ChargeForm />
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mt-4"
          >
            Voltar para Lista
          </Button>
        </div>
      );
    }

    if (activeSection === "templates") {
      return <TemplatesList />;
    }

    return (
      <div className="mt-6 space-y-8">
        <DashboardStats />
        {activeSection === "charges" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Cobranças</h2>
            </div>
            {session?.user?.id && <ChargesList companyId={session.user.id} />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {renderHeader()}
      {renderContent()}
    </div>
  );
}