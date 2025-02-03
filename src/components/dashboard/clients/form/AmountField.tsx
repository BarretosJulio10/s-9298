import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client>;
}

export function AmountField({ form }: AmountFieldProps) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos e converte para número
    const rawValue = event.target.value.replace(/\D/g, '');
    
    // Converte o valor para reais (divide por 100 para considerar os centavos)
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
    
    console.log('Valor original:', event.target.value);
    console.log('Valor processado:', rawValue);
    console.log('Valor final:', numericValue);
    
    form.setValue('charge_amount', numericValue);
  };

  const formatAmount = (value: number | undefined) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(value);
  };

  return (
    <FormField
      control={form.control}
      name="charge_amount"
      render={({ field }) => (
        <FormItem className="w-36">
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                R$
              </span>
              <InputMask
                mask={field.value ? "999.999,99" : ""}
                maskChar={null}
                value={formatAmount(field.value)}
                onChange={handleAmountChange}
              >
                {(inputProps: any) => (
                  <Input 
                    {...inputProps}
                    className="pl-10 text-lg h-10"
                  />
                )}
              </InputMask>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}