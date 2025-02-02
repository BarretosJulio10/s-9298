import { Button } from "@/components/ui/button";

interface LoginButtonProps {
  isLoading: boolean;
}

const LoginButton = ({ isLoading }: LoginButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? "Carregando..." : "Entrar"}
    </Button>
  );
};

export default LoginButton;