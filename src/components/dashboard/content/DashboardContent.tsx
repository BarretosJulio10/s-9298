import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { TemplateForm } from "@/components/dashboard/templates/TemplateForm";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
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
        <TemplateForm onCancel={onBack} />
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
    <div className="mt-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Templates de Mensagem</h2>
        <TemplatesList />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Cobranças</h2>
        <ChargesList />
      </div>
    </div>
  );
}