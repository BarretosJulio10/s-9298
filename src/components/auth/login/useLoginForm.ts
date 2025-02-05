import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Email ou senha incorretos. Por favor, verifique suas credenciais.",
          });
        } else {
          console.error("Erro detalhado:", error);
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
          });
        }
        return;
      }

      if (!data.user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Usuário não encontrado.",
        });
        return;
      }

      // Busca o papel do usuário
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        console.error('Erro ao buscar papel do usuário:', roleError);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao verificar permissões do usuário.",
        });
        return;
      }

      // Redireciona baseado no papel do usuário
      if (roleData?.role === 'admin') {
        navigate('/admin');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo!",
        });
      } else if (roleData?.role === 'company') {
        navigate('/dashboard');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao PagouPix!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Tipo de usuário não reconhecido.",
        });
      }
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  };
};