import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./components/routing/AppRoutes";
import { useAuth } from "./hooks/useAuth";
import { useUserRole } from "./hooks/useUserRole";

const queryClient = new QueryClient();

function App() {
  const { session, loading, setLoading } = useAuth();
  const { userRole, fetchUserRole } = useUserRole(session, setLoading);

  useEffect(() => {
    if (session?.user) {
      fetchUserRole(session.user.id);
    }
  }, [session, fetchUserRole]);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes session={session} userRole={userRole} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;