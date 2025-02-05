
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CompanyDashboard from "@/pages/CompanyDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/admin/AdminHome";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminWhatsApp from "@/pages/admin/AdminWhatsApp";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

export function AppRoutes() {
  const { session, loading, setLoading } = useAuth();
  const { userRole, fetchUserRole } = useUserRole(session, setLoading);

  if (loading) {
    return null;
  }

  const publicRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );

  if (!session) {
    console.log("Sem sessão, mostrando rotas públicas");
    return publicRoutes;
  }

  if (!userRole && session.user) {
    console.log("Buscando papel do usuário");
    fetchUserRole(session.user.id);
    return null;
  }

  if (userRole === 'admin') {
    console.log("Usuário admin, mostrando painel admin");
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="whatsapp" element={<AdminWhatsApp />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  console.log("Usuário empresa, mostrando painel empresa");
  return (
    <Routes>
      <Route path="/dashboard/*" element={<CompanyDashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
