import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  cnpj: string;
  setCnpj: (cnpj: string) => void;
}

const RegisterFields = ({
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
}: RegisterFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="companyName">Nome da Empresa</Label>
        <Input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          id="cnpj"
          type="text"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default RegisterFields;