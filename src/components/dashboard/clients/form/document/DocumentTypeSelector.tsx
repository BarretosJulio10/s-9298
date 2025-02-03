import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DocumentTypeSelectorProps {
  value: 'cpf' | 'cnpj';
  onChange: (value: 'cpf' | 'cnpj') => void;
}

export function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  return (
    <RadioGroup 
      defaultValue={value} 
      className="flex items-center gap-4 mb-2"
      onValueChange={(value: 'cpf' | 'cnpj') => onChange(value)}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cpf" id="cpf" />
        <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cnpj" id="cnpj" />
        <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
      </div>
    </RadioGroup>
  );
}