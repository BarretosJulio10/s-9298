import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface DashboardContentProps {
  showChargeForm: boolean;
  onBack: () => void;
}

export function DashboardContent({ 
  showChargeForm, 
  onBack 
}: DashboardContentProps) {
  const { session } = useAuth();

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
        {session?.user?.id && <ChargesList companyId={session.user.id} />}
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