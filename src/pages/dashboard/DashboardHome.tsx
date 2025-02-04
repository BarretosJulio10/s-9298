import { useState } from "react";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";

const DashboardHome = () => {
  const [showChargeForm, setShowChargeForm] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleBack = () => {
    setShowChargeForm(false);
  };

  return (
    <main>
      <DashboardContent 
        showChargeForm={showChargeForm}
        onBack={handleBack}
        activeSection={activeSection}
      />
    </main>
  );
};

export default DashboardHome;