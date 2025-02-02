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
      // Primeiro, tenta fazer o login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Email ou senha incorretos. Por favor, verifique suas credenciais.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
          });
        }
        return;
      }

      // Após login bem sucedido, busca o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
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
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Erro ao buscar papel do usuário:', roleError);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao verificar permissões do usuário.",
        });
        return;
      }

      if (!roleData) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Perfil de usuário não encontrado. Por favor, contate o suporte.",
        });
        return;
      }

      // Redireciona baseado no papel do usuário
      if (roleData.role === 'admin') {
        navigate('/admin');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo!",
        });
      } else {
        navigate('/dashboard');
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao PagouPix!",
        });
      }
    } catch (error: any) {
      console.error('Erro no processo de login:', error);
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