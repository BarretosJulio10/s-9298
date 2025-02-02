import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { CompanySettingsForm } from "@/components/dashboard/settings/CompanySettingsForm";
import { useAuth } from "@/hooks/useAuth";
import { Home, CreditCard, MessageSquare, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardHome from "./dashboard/DashboardHome";

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-3 py-2">
              <h2 className="text-lg font-semibold mb-2">PagouPix</h2>
              <p className="text-sm text-muted-foreground">Painel da Empresa</p>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("home")}
                  className={activeSection === "home" ? "bg-accent" : ""}
                >
                  <Home className="h-4 w-4" />
                  <span>Início</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("charges")}
                  className={activeSection === "charges" ? "bg-accent" : ""}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Cobranças</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("templates")}
                  className={activeSection === "templates" ? "bg-accent" : ""}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("settings")}
                  className={activeSection === "settings" ? "bg-accent" : ""}
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;