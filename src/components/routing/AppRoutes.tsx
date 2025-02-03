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

interface AppRoutesProps {
  session: any;
  userRole: string | null;
}

const AppRoutes = ({ session, userRole }: AppRoutesProps) => {
  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  if (userRole === 'admin') {
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

  return (
    <Routes>
      <Route path="/dashboard/*" element={<CompanyDashboard />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;