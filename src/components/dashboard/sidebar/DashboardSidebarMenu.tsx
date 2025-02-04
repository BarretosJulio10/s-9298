import { Home, CreditCard, User, Wallet, MessageSquare, Settings } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarMenuProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebarMenu({ 
  activeSection, 
  onSectionChange 
}: DashboardSidebarMenuProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Início", section: "home" },
    { icon: User, label: "Clientes", section: "clients" },
    { icon: Wallet, label: "Carteira", section: "wallet" },
    { icon: CreditCard, label: "Cobranças", section: "charges" },
    { icon: MessageSquare, label: "Templates", section: "templates" },
    { icon: Settings, label: "Configurações", section: "settings" },
  ];

  const handleClick = (section: string) => {
    onSectionChange(section);
  };

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
          onClick={() => handleClick(item.section)}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}