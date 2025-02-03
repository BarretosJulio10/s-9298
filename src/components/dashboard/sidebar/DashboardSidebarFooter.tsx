import { LogOut } from "lucide-react";

interface DashboardSidebarFooterProps {
  userRole: string;
  onLogout: () => void;
}

export function DashboardSidebarFooter({ 
  userRole, 
  onLogout 
}: DashboardSidebarFooterProps) {
  return (
    <div className="mt-auto border-t border-gray-200">
      <div className="text-sm text-gray-600 px-3 py-2">
        {userRole === 'admin' ? 'Painel Admin' : 'Painel Empresa'}
      </div>
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </div>
  );
}