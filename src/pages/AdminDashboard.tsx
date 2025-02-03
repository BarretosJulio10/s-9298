import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0">
            <h1 className="text-2xl font-semibold text-gray-800">Painel Administrativo</h1>
          </div>
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;