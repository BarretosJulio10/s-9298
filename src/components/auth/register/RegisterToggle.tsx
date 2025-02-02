interface RegisterToggleProps {
  onToggleMode: () => void;
}

const RegisterToggle = ({ onToggleMode }: RegisterToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggleMode}
      className="text-sm text-primary hover:underline"
    >
      Já tem uma conta? Entre
    </button>
  );
};

export default RegisterToggle;