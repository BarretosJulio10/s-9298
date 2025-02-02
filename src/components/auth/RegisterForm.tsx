import { useRegisterForm } from "./register/useRegisterForm";
import RegisterFields from "./register/RegisterFields";
import RegisterButton from "./register/RegisterButton";
import RegisterToggle from "./register/RegisterToggle";

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    companyName,
    setCompanyName,
    cnpj,
    setCnpj,
    handleRegister,
  } = useRegisterForm();

  return (
    <div className="space-y-6">
      <form onSubmit={handleRegister}>
        <RegisterFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          companyName={companyName}
          setCompanyName={setCompanyName}
          cnpj={cnpj}
          setCnpj={setCnpj}
        />

        <div className="mt-6">
          <RegisterButton isLoading={isLoading} />
        </div>
      </form>

      <div className="text-center">
        <RegisterToggle onToggleMode={onToggleMode} />
      </div>
    </div>
  );
};

export default RegisterForm;