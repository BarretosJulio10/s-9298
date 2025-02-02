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
  const getDashboardRoute = () => {
    if (!session) return <Navigate to="/auth" replace />;
    
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    return <Dashboard />;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/dashboard"
        element={getDashboardRoute()}
      />
      <Route
        path="/auth"
        element={
          !session ? (
            <Auth />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          session && userRole === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;