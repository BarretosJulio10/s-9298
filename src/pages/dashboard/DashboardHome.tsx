import { useState } from "react";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";

const DashboardHome = () => {
  const [showChargeForm, setShowChargeForm] = useState(false);

  const handleBack = () => {
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
      </div>

      <DashboardContent 
        showChargeForm={showChargeForm}
        onBack={handleBack}
      />
    </div>
  );
}

export default DashboardHome;