import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CompanyDashboard from "@/pages/CompanyDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/admin/AdminHome";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminWhatsApp from "@/pages/admin/AdminWhatsApp";
import AdminCharges from "@/pages/admin/AdminCharges";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const AppRoutes = () => {
  const { session, loading, setLoading } = useAuth();
  const { userRole, fetchUserRole } = useUserRole(session, setLoading);

  // Não renderiza nada enquanto estiver carregando
  if (loading) {
    return null;
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );

  // Se não houver sessão, retorna apenas rotas públicas
  if (!session) {
    console.log("Sem sessão, mostrando rotas públicas");
    return publicRoutes;
  }

  // Rotas para administradores
  if (userRole === 'admin') {
    console.log("Usuário admin, mostrando painel admin");
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="charges" element={<AdminCharges />} />
          <Route path="whatsapp" element={<AdminWhatsApp />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Rotas para empresas
  console.log("Usuário empresa, mostrando painel empresa");
  return (
    <Routes>
      <Route path="/dashboard/*" element={<CompanyDashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;