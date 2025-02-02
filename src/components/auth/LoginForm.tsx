import { useLoginForm } from "./login/useLoginForm";
import LoginFields from "./login/LoginFields";
import LoginButton from "./login/LoginButton";
import LoginToggle from "./login/LoginToggle";

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
  } = useLoginForm();

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin}>
        <LoginFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <div className="mt-6">
          <LoginButton isLoading={isLoading} />
        </div>
      </form>

      <div className="text-center">
        <LoginToggle onToggleMode={onToggleMode} />
      </div>
    </div>
  );
};

export default LoginForm;