import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";

interface DocumentInputProps {
  value: string;
  onChange: (value: string) => void;
  mask: string;
  isValid: boolean;
  documentType: 'cpf' | 'cnpj';
}

export function DocumentInput({ 
  value, 
  onChange, 
  mask, 
  isValid, 
  documentType 
}: DocumentInputProps) {
  return (
    <div className="flex-1 relative">
      <InputMask
        mask={mask}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maskChar={null}
      >
        {(inputProps: any) => (
          <FormControl>
            <Input 
              placeholder={documentType === 'cpf' ? "CPF" : "CNPJ"}
              {...inputProps} 
              className="bg-white pr-16"
            />
          </FormControl>
        )}
      </InputMask>
      {value && value.replace(/[^\d]/g, '').length === (documentType === 'cpf' ? 11 : 14) && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? 'Válido' : 'Inválido'}
        </span>
      )}
    </div>
  );
}