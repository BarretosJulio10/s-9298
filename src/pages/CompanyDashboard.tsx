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

  const grid = 32; // Even smaller grid size for tighter spacing

  const snapToGrid = (x: number, y: number) => {
    return {
      x: Math.round(x / grid) * grid,
      y: Math.round(y / grid) * grid,
    };
  };

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
          <div className="fixed left-8 top-24 flex flex-col justify-between h-[calc(100vh-8rem)] w-48">
            <div className="space-y-0.5"> {/* Reduced space between items */}
              {menuItems.map((item, index) => (
                <Draggable
                  key={item.section}
                  defaultPosition={{ x: 0, y: index * grid }}
                  grid={[grid, grid]}
                  bounds="parent"
                  onStop={(e, data) => {
                    const { x, y } = snapToGrid(data.x, data.y);
                    const dragElement = e.target as HTMLElement;
                    dragElement.style.transform = `translate(${x}px, ${y}px)`;
                  }}
                >
                  <div 
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-move transition-all duration-200 ${
                      activeSection === item.section 
                        ? "bg-primary text-white shadow-lg" 
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-primary shadow"
                    }`}
                    onClick={() => setActiveSection(item.section as ActiveSection)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Draggable>
              ))}
            </div>

            <Draggable
              defaultPosition={{ x: 0, y: 0 }}
              grid={[grid, grid]}
              bounds="parent"
              onStop={(e, data) => {
                const { x, y } = snapToGrid(data.x, data.y);
                const dragElement = e.target as HTMLElement;
                dragElement.style.transform = `translate(${x}px, ${y}px)`;
              }}
            >
              <div 
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-move bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-lg"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium text-sm">Sair</span>
              </div>
            </Draggable>
          </div>

          <div className="ml-56">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;