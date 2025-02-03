import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface DocumentFieldProps {
  form: UseFormReturn<Client>;
}

export function DocumentField({ form }: DocumentFieldProps) {
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [isValidDocument, setIsValidDocument] = useState(false);

  // Função para validar CPF
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  };

  // Função para validar CNPJ
  const validateCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
  };

  // Função para gerar dígito verificador do CPF
  const generateVerifierDigit = (digits: number[]): number => {
    const sum = digits.reduce((acc, digit, index) => acc + digit * (digits.length + 1 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Função para gerar CPF válido
  const generateValidCPF = () => {
    const numbers = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    const digit1 = generateVerifierDigit(numbers);
    const digit2 = generateVerifierDigit([...numbers, digit1]);
    
    const cpf = [...numbers, digit1, digit2].join('');
    const formattedCPF = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    form.setValue('document', formattedCPF);
    setIsValidDocument(true);
  };

  // Função para gerar CNPJ válido
  const generateValidCNPJ = () => {
    const numbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    
    let soma = 0;
    let multiplicador = 5;
    for (let i = 0; i < 12; i++) {
      soma += numbers[i] * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    const digit1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    numbers.push(digit1);
    
    soma = 0;
    multiplicador = 6;
    for (let i = 0; i < 13; i++) {
      soma += numbers[i] * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    const digit2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    numbers.push(digit2);
    
    const cnpj = numbers.join('');
    const formattedCNPJ = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    form.setValue('document', formattedCNPJ);
    setIsValidDocument(true);
  };

  const handleDocumentChange = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    if (documentType === 'cpf' && cleanValue.length === 11) {
      setIsValidDocument(validateCPF(cleanValue));
    } else if (documentType === 'cnpj' && cleanValue.length === 14) {
      setIsValidDocument(validateCNPJ(cleanValue));
    } else {
      setIsValidDocument(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="document"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-4">
            <RadioGroup 
              defaultValue="cpf" 
              className="flex gap-4"
              onValueChange={(value: 'cpf' | 'cnpj') => {
                setDocumentType(value);
                form.setValue('document', '');
                setIsValidDocument(false);
              }}
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

            <div className="flex flex-1 gap-2">
              <div className="flex-1 relative min-w-[200px]">
                <InputMask
                  mask={documentType === 'cpf' ? "999.999.999-99" : "99.999.999/9999-99"}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value);
                    handleDocumentChange(value);
                  }}
                  maskChar={null}
                >
                  {(inputProps: any) => (
                    <FormControl>
                      <Input 
                        placeholder={documentType === 'cpf' ? "CPF" : "CNPJ"}
                        {...inputProps} 
                        className="bg-white"
                      />
                    </FormControl>
                  )}
                </InputMask>
                {field.value && field.value.replace(/[^\d]/g, '').length === (documentType === 'cpf' ? 11 : 14) && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isValidDocument ? 'text-green-500' : 'text-red-500'}`}>
                    {isValidDocument ? 'Válido' : 'Inválido'}
                  </span>
                )}
              </div>
              {(documentType === 'cpf' || documentType === 'cnpj') && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={documentType === 'cpf' ? generateValidCPF : generateValidCNPJ}
                  title={`Gerar ${documentType.toUpperCase()} válido`}
                  className="flex-shrink-0"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}