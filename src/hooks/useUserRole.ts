import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useUserRole = (session: any, setLoading: (loading: boolean) => void) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Nenhum perfil encontrado para este usuário",
        });
        setUserRole(null);
        return;
      }
      
      setUserRole(data.role);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar perfil do usuário",
      });
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  return { userRole, fetchUserRole };
};