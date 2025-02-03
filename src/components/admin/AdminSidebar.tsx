import { Home, Users, Package, Settings2, LogOut, MessageSquare, Receipt } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Empresas",
    url: "/admin/companies",
    icon: Users,
  },
  {
    title: "Planos",
    url: "/admin/plans",
    icon: Package,
  },
  {
    title: "Cobranças",
    url: "/admin/charges",
    icon: Receipt,
  },
  {
    title: "WhatsApp",
    url: "/admin/whatsapp",
    icon: MessageSquare,
  },
  {
    title: "Configurações",
    url: "/admin/settings",
    icon: Settings2,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você será redirecionado para a página principal",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao realizar logout",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent className="flex flex-col h-full">
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">PagouPix</h2>
          <p className="text-sm text-muted-foreground mt-1">Painel Administrativo</p>
        </div>

        <SidebarGroup className="flex-1 px-4 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-t border-gray-200 p-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}