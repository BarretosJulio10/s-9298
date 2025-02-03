import { useAuth } from "@/hooks/useAuth";
import { Home, CreditCard, MessageSquare, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHome from "./dashboard/DashboardHome";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { CompanySettingsForm } from "@/components/dashboard/settings/CompanySettingsForm";

type ActiveSection = "home" | "charges" | "templates" | "settings";

const CompanyDashboard = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");
  const [companyName, setCompanyName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

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

  const menuItems = [
    { icon: Home, label: "Início", section: "home" },
    { icon: CreditCard, label: "Cobranças", section: "charges" },
    { icon: MessageSquare, label: "Templates", section: "templates" },
    { icon: Settings, label: "Configurações", section: "settings" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome />;
      case "charges":
        return <CompanyCharges companyId={session?.user?.id || ""} />;
      case "settings":
        return <CompanySettingsForm />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo ao seu painel</h2>
            <p className="text-muted-foreground">
              Selecione uma opção no menu para começar.
            </p>
          </div>
        );
    }
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
        <div className="w-48 min-h-[calc(100vh-3rem)] bg-white border-r border-gray-200 fixed left-0 top-12 flex flex-col">
          <div className="flex-1 space-y-1 px-3 py-2">
            {menuItems.map((item) => (
              <button
                key={item.section}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.section
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(item.section as ActiveSection)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="px-3 pb-3 border-t border-gray-200">
            <div className="text-sm text-gray-600 px-3 py-2">
              {userRole === 'admin' ? 'Painel Admin' : 'Painel Empresa'}
            </div>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        <div className="flex-1 ml-48">
          <div className="max-w-full mx-4 py-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;