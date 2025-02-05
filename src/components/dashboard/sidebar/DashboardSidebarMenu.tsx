
import { Home, User, Wallet, MessageSquare, Settings, Receipt } from "lucide-react";

interface DashboardSidebarMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { icon: Home, label: "Início", section: "home" },
  { icon: User, label: "Clientes", section: "clients" },
  { icon: Receipt, label: "Faturas", section: "invoices" },
  { icon: Wallet, label: "Carteira", section: "wallet" },
  { icon: MessageSquare, label: "Templates", section: "templates" },
  { icon: Settings, label: "Configurações", section: "settings" },
] as const;

export function DashboardSidebarMenu({ 
  activeSection, 
  onSectionChange 
}: DashboardSidebarMenuProps) {
  return (
    <div className="flex-1 space-y-1 px-3 py-2">
      {menuItems.map((item) => (
        <button
          key={item.section}
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
      ))}
    </div>
  );
}
