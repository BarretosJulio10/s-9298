import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
        
        return (
          <FormItem className="space-y-4">
            <RadioGroup 
              defaultValue="cpf" 
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => {
                form.setValue('document', '');
              }}
            >
              <div>
                <RadioGroupItem value="cpf" id="cpf" className="peer sr-only" />
                <Label
                  htmlFor="cpf"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  CPF
                </Label>
              </div>
              <div>
                <RadioGroupItem value="cnpj" id="cnpj" className="peer sr-only" />
                <Label
                  htmlFor="cnpj"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  CNPJ
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <InputMask
                mask={value.length > 11 ? "99.999.999/9999-99" : "999.999.999-99"}
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const numericValue = newValue.replace(/\D/g, '');
                  if (numericValue.length <= 14) {
                    field.onChange(newValue);
                  }
                }}
                maskChar={null}
              >
                {(inputProps: any) => (
                  <Input 
                    placeholder={value.length > 11 ? "CNPJ" : "CPF"}
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}