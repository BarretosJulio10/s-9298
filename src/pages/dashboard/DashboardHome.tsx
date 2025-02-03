import { useState } from "react";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { DashboardActions } from "@/components/dashboard/actions/DashboardActions";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";

interface DashboardHomeProps {
  showTemplateForm: boolean;
  showChargeForm: boolean;
  onBack: () => void;
  activeSection: string;
}

const DashboardHome = ({ 
  showTemplateForm, 
  showChargeForm, 
  onBack,
  activeSection 
}: DashboardHomeProps) => {
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
          onNewTemplate={() => {}}
          onNewCharge={() => {}}
        />
      </div>

      <DashboardStats />

      <DashboardContent 
        showTemplateForm={showTemplateForm}
        showChargeForm={showChargeForm}
        onBack={onBack}
        activeSection={activeSection}
      />
    </div>
  );
};

export default DashboardHome;