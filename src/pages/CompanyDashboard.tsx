import { useAuth } from "@/hooks/useAuth";
import { Home, CreditCard, MessageSquare, Settings, LogOut, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHome from "./dashboard/DashboardHome";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { CompanySettingsForm } from "@/components/dashboard/settings/CompanySettingsForm";
import { ClientsList } from "@/components/dashboard/clients/ClientsList";

type ActiveSection = "home" | "charges" | "templates" | "settings" | "clients";

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

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome />;
      case "charges":
        return <CompanyCharges companyId={session?.user?.id || ""} />;
      case "settings":
        return <CompanySettingsForm />;
      case "clients":
        return <ClientsList />;
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

  const menuItems = [
    { icon: Home, label: "Início", section: "home" },
    { icon: CreditCard, label: "Cobranças", section: "charges" },
    { icon: Users, label: "Clientes", section: "clients" },
    { icon: MessageSquare, label: "Templates", section: "templates" },
    { icon: Settings, label: "Configurações", section: "settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          {activeSection === "home" && "Dashboard"}
          {activeSection === "charges" && "Cobranças"}
          {activeSection === "templates" && "Templates"}
          {activeSection === "settings" && "Configurações"}
          {activeSection === "clients" && "Clientes"}
        </h1>
      </div>

      <main className="p-8">
        <div className="max-w-7xl mx-auto relative">
          <div className="fixed left-6 top-24 w-40 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.section}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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
            
            <button
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>

          <div className="ml-44">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;