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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DashboardActions 
          onNewTemplate={() => setShowTemplateForm(true)}
          onNewCharge={() => setShowChargeForm(true)}
        />
      </div>
      
      <DashboardStats />

      <DashboardContent 
        showTemplateForm={showTemplateForm}
        showChargeForm={showChargeForm}
        onBack={handleBack}
      />
    </div>
  );
};

export default DashboardHome;