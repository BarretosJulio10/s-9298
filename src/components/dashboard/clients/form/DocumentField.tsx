import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface DocumentFieldProps {
  form: UseFormReturn<Client>;
}

export function DocumentField({ form }: DocumentFieldProps) {
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
  };

  return (
    <FormField
      control={form.control}
      name="document"
      render={({ field }) => {
        const value = field.value || '';
        const numericValue = value.replace(/\D/g, '');
        const isCNPJ = numericValue.length > 11;
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const numericValue = newValue.replace(/\D/g, '');
          
          // Permite a entrada de até 14 dígitos (CNPJ)
          if (numericValue.length <= 14) {
            field.onChange(newValue);
          }
        };
        
        return (
          <FormItem className="relative">
            <FormControl>
              <div className="flex gap-2">
                <InputMask
                  mask={isCNPJ ? "99.999.999/9999-99" : "999.999.999-99"}
                  value={value}
                  onChange={handleChange}
                  maskChar={null}
                >
                  {(inputProps: any) => (
                    <Input 
                      placeholder={isCNPJ ? "CNPJ" : "CPF"} 
                      {...inputProps} 
                    />
                  )}
                </InputMask>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateValidCPF}
                  title="Gerar CPF válido"
                  className="flex-shrink-0"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}