import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há uma sessão persistida
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Sessão atual:", currentSession);
        setSession(currentSession);
        
        if (!currentSession) {
          console.log("Sem sessão, redirecionando para /auth");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Mudança no estado da autenticação:", event, currentSession);
      setSession(currentSession);

      if (!currentSession) {
        console.log("Sessão terminada, redirecionando para /auth");
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, loading, setLoading };
}