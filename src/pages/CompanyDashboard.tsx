import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHome from "./dashboard/DashboardHome";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { CompanySettingsForm } from "@/components/dashboard/settings/CompanySettingsForm";
import { DashboardSidebarMenu } from "@/components/dashboard/sidebar/DashboardSidebarMenu";
import { DashboardSidebarFooter } from "@/components/dashboard/sidebar/DashboardSidebarFooter";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";

type ActiveSection = "home" | "clients" | "plans" | "wallet" | "charges" | "templates" | "settings";

const CompanyDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [companyName, setCompanyName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showChargeForm, setShowChargeForm] = useState(false);

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (session?.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_name')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profileData) {
          setCompanyName(profileData.company_name || '');
        }

        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (!roleError && roleData) {
          setUserRole(roleData.role);
        }
      }
    };

    fetchCompanyName();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout",
      });
    }
  };

  const handleNewTemplate = () => {
    setShowTemplateForm(true);
    setActiveSection("templates");
  };

  const handleBack = () => {
    setShowTemplateForm(false);
    setShowChargeForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-12 bg-white border-r border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          PagouPix
        </h1>
        <span className="text-gray-600">
          {companyName}
        </span>
      </div>

      <div className="flex">
        <div className="w-48 h-[calc(100vh-3rem)] bg-white border-r border-gray-200 fixed left-0 top-12 flex flex-col">
          <DashboardSidebarMenu 
            activeSection={activeSection} 
            onSectionChange={(section) => setActiveSection(section as ActiveSection)} 
            onNewTemplate={handleNewTemplate}
          />
          <DashboardSidebarFooter 
            userRole={userRole} 
            onLogout={handleLogout} 
          />
        </div>

        <div className="flex-1 ml-48">
          <div className="max-w-full mx-4 py-4">
            <DashboardContent 
              showTemplateForm={showTemplateForm}
              showChargeForm={showChargeForm}
              onBack={handleBack}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;