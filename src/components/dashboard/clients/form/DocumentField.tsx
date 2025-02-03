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
      render={({ field }) => (
        <FormItem className="space-y-4">
          <RadioGroup 
            defaultValue="cpf" 
            className="grid grid-cols-2 gap-4 mb-4"
            onValueChange={(value: 'cpf' | 'cnpj') => {
              setDocumentType(value);
              form.setValue('document', '');
            }}
          >
            <div className="relative">
              <RadioGroupItem value="cpf" id="cpf" className="peer sr-only" />
              <Label
                htmlFor="cpf"
                className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                CPF
              </Label>
            </div>

            <div className="relative">
              <RadioGroupItem value="cnpj" id="cnpj" className="peer sr-only" />
              <Label
                htmlFor="cnpj"
                className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                CNPJ
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-2">
            <InputMask
              mask={documentType === 'cpf' ? "999.999.999-99" : "99.999.999/9999-99"}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
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
            {documentType === 'cpf' && (
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
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}