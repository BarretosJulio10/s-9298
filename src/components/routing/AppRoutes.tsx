import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";

interface AppRoutesProps {
  session: any;
  userRole: string | null;
}

const AppRoutes = ({ session, userRole }: AppRoutesProps) => {
  const getDashboardRoute = () => {
    if (!session) return <Navigate to="/auth" replace />;
    
    if (userRole === 'admin') {
      return <AdminDashboard />;
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
    </Routes>
  );
};

export default AppRoutes;