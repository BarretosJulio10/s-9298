import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/admin/AdminHome";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminWhatsApp from "@/pages/admin/AdminWhatsApp";

interface AppRoutesProps {
  session: any;
  userRole: string | null;
}

const AppRoutes = ({ session, userRole }: AppRoutesProps) => {
  // Se não estiver autenticado, redireciona para /auth
  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Se for admin, mostra apenas as rotas de admin
  if (userRole === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="whatsapp" element={<AdminWhatsApp />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Se for usuário comum, mostra apenas as rotas de usuário
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;