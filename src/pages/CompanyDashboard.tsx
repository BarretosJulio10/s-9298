import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { useAuth } from "@/hooks/useAuth";
import { Home, CreditCard, MessageSquare, Settings } from "lucide-react";

const CompanyDashboard = () => {
  const { session } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Início</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/charges">
                    <CreditCard className="h-4 w-4" />
                    <span>Cobranças</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/templates">
                    <MessageSquare className="h-4 w-4" />
                    <span>Templates</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <CompanyCharges companyId={session?.user?.id || ''} />
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;