import { useAuth } from "@/hooks/useAuth";
import { Home, CreditCard, MessageSquare, Settings, LogOut } from "lucide-react";
import { useState } from "react";
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
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-40 min-h-[calc(100vh-3rem)] bg-white border-r border-gray-200 fixed left-0 top-12">
          <div className="flex flex-col h-full py-2">
            <div className="flex-1 space-y-1 px-2">
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
            
            <div className="px-2">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-40">
          <div className="max-w-full mx-2">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;