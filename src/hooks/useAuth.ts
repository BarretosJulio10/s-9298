import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Sessão inicial:", currentSession);
      setSession(currentSession);
      setLoading(false);
      
      if (!currentSession) {
        console.log("Sem sessão ativa, redirecionando para /auth");
        navigate("/auth");
      }
    });

    // Configura o listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log("Mudança no estado da autenticação:", _event, currentSession);
      setSession(currentSession);
      
      if (!currentSession) {
        console.log("Sessão terminada, redirecionando para /auth");
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return {
    session,
    loading,
    setLoading,
  };
}