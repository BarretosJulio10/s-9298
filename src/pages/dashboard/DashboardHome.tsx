import { useState } from "react";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";
import { DashboardSidebarMenu } from "@/components/dashboard/sidebar/DashboardSidebarMenu";

const DashboardHome = () => {
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleBack = () => {
    setShowChargeForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200">
        <DashboardSidebarMenu 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      </aside>

      <main className="flex-1 p-8">
        <DashboardContent 
          showChargeForm={showChargeForm}
          onBack={handleBack}
          activeSection={activeSection}
        />
      </main>
    </div>
  );
};

export default DashboardHome;