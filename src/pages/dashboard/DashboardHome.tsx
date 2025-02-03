import { useState } from "react";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { DashboardActions } from "@/components/dashboard/actions/DashboardActions";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";

const DashboardHome = () => {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showChargeForm, setShowChargeForm] = useState(false);

  const handleBack = () => {
    setShowTemplateForm(false);
    setShowChargeForm(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Gerencie suas cobranças e acompanhe seus resultados
          </p>
        </div>
        <DashboardActions 
          onNewTemplate={() => setShowTemplateForm(true)}
          onNewCharge={() => setShowChargeForm(true)}
        />
      </div>

      <DashboardContent 
        showTemplateForm={showTemplateForm}
        showChargeForm={showChargeForm}
        onBack={handleBack}
        activeSection="home"
      />
    </div>
  );
}

export default DashboardHome;