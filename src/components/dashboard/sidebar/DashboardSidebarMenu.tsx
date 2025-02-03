import { Home, CreditCard, User, Wallet, MessageSquare, Settings, Plus } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

interface DashboardSidebarMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNewTemplate: () => void;
}

export function DashboardSidebarMenu({ 
  activeSection, 
  onSectionChange,
  onNewTemplate 
}: DashboardSidebarMenuProps) {
  const menuItems = [
    { icon: Home, label: "Início", section: "home" },
    { icon: User, label: "Clientes", section: "clients" },
    { icon: Wallet, label: "Carteira", section: "wallet" },
    { icon: CreditCard, label: "Cobranças", section: "charges" },
    { icon: MessageSquare, label: "Templates", section: "templates" },
    { icon: Settings, label: "Configurações", section: "settings" },
  ];

  return (
    <div className="flex-1 space-y-1 px-3 py-2">
      {menuItems.map((item) => (
        <div key={item.section}>
          <button
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeSection === item.section
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onSectionChange(item.section)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
          
          {/* Adiciona o botão Novo Template dentro do menu Templates */}
          {item.section === "templates" && activeSection === "templates" && (
            <button
              className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onNewTemplate}
            >
              <Plus className="h-4 w-4" />
              <span>Novo Template</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}