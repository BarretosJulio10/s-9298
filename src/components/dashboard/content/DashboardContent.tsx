import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { TemplatesList } from "@/components/dashboard/templates/TemplatesList";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TemplateForm } from "@/components/dashboard/templates/TemplateForm";

interface DashboardContentProps {
  showChargeForm: boolean;
  onBack: () => void;
  activeSection: string;
}

export function DashboardContent({ 
  showChargeForm, 
  onBack,
  activeSection 
}: DashboardContentProps) {
  const { session } = useAuth();
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);

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
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Templates Criados</h2>
          <Button 
            onClick={() => setShowNewTemplateForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            + Novo template
          </Button>
        </div>

        <TemplatesList />

        <Dialog open={showNewTemplateForm} onOpenChange={setShowNewTemplateForm}>
          <DialogContent className="sm:max-w-[600px]">
            <TemplateForm onCancel={() => setShowNewTemplateForm(false)} />
          </DialogContent>
        </Dialog>
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
    </div>
  );
}