interface LoginToggleProps {
  onToggleMode: () => void;
}

const LoginToggle = ({ onToggleMode }: LoginToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggleMode}
      className="text-sm text-primary hover:underline"
    >
      Não tem uma conta? Cadastre-se
    </button>
  );
};

export default LoginToggle;