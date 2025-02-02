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
import { Home, CreditCard, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";
import DashboardHome from "./dashboard/DashboardHome";

type ActiveSection = "home" | "charges" | "templates" | "settings";

const CompanyDashboard = () => {
  const { session } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("home");

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;