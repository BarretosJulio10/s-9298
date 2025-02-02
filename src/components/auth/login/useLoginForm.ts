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
          return;
        }
        throw signInError;
      }

      // Fetch user role after successful login
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (roleError) throw roleError;

      // Redirect based on user role
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
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
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