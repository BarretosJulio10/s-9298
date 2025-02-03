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
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";

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
          {menuItems.map((item, index) => (
            <Draggable key={item.section} defaultPosition={{ x: 0, y: index * 60 }}>
              <div className="absolute left-0">
                <Button
                  variant={activeSection === item.section ? "default" : "secondary"}
                  className="w-48 flex items-center gap-2 cursor-move"
                  onClick={() => setActiveSection(item.section as ActiveSection)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </div>
            </Draggable>
          ))}

          <div className="ml-56">
            {renderContent()}
          </div>

          <Draggable defaultPosition={{ x: 0, y: menuItems.length * 60 }}>
            <div className="absolute left-0">
              <Button
                variant="destructive"
                className="w-48 flex items-center gap-2 cursor-move"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Button>
            </div>
          </Draggable>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;