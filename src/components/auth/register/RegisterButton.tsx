import { Button } from "@/components/ui/button";

interface RegisterButtonProps {
  isLoading: boolean;
}

const RegisterButton = ({ isLoading }: RegisterButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? "Carregando..." : "Criar conta"}
    </Button>
  );
};

export default RegisterButton;