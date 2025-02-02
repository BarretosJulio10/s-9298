import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminHome from "@/pages/admin/AdminHome";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminPlans from "@/pages/admin/AdminPlans";
import AdminSettings from "@/pages/admin/AdminSettings";

interface AppRoutesProps {
  session: any;
  userRole: string | null;
}

const AppRoutes = ({ session, userRole }: AppRoutesProps) => {
  // Redirect to admin dashboard if user is admin
  if (session && userRole === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Regular user routes
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/dashboard"
        element={
          session ? <Dashboard /> : <Navigate to="/auth" replace />
        }
      />
      <Route
        path="/auth"
        element={
          !session ? <Auth /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;