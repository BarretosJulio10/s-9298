import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { TemplateForm } from "@/components/dashboard/templates/TemplateForm";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { Button } from "@/components/ui/button";

interface DashboardContentProps {
  showTemplateForm: boolean;
  showChargeForm: boolean;
  onBack: () => void;
}

export function DashboardContent({ 
  showTemplateForm, 
  showChargeForm, 
  onBack 
}: DashboardContentProps) {
  if (showTemplateForm) {
    return (
      <div className="mt-6">
        <TemplateForm />
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

  return (
    <div className="mt-6 space-y-8">
      <DashboardStats />

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Cobranças</h2>
        </div>
        <ChargesList />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Templates de Mensagem</h2>
        </div>
        <TemplatesList />
      </div>
    </div>
  );
}