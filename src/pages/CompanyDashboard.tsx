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
      <Sidebar className="border-r border-gray-200">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-3 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-primary">PagouPix</h2>
              <p className="text-sm text-muted-foreground mt-1">Painel da Empresa</p>
            </div>
            <div className="py-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("home")}
                    className={`w-full ${activeSection === "home" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("charges")}
                    className={`w-full ${activeSection === "charges" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Cobranças</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("templates")}
                    className={`w-full ${activeSection === "templates" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Templates</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("settings")}
                    className={`w-full ${activeSection === "settings" ? "bg-primary/10 text-primary" : ""}`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-2xl font-semibold">
            {activeSection === "home" && "Dashboard"}
            {activeSection === "charges" && "Cobranças"}
            {activeSection === "templates" && "Templates"}
            {activeSection === "settings" && "Configurações"}
          </h1>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;