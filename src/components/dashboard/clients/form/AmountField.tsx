import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import InputMask from "react-input-mask";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client>;
}

export function AmountField({ form }: AmountFieldProps) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, '');
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
    
    console.log('Valor original:', event.target.value);
    console.log('Valor processado:', rawValue);
    console.log('Valor final:', numericValue);
    
    form.setValue('charge_amount', numericValue);
  };

  const formatAmount = (value: number | undefined) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <FormField
      control={form.control}
      name="charge_amount"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>Valor da Cobrança</FormLabel>
          <FormControl>
            <div className="relative">
              <InputMask
                mask="R$ 999.999,99"
                maskChar={null}
                value={formatAmount(field.value)}
                onChange={handleAmountChange}
              >
                {(inputProps: any) => (
                  <Input 
                    {...inputProps}
                    className="text-lg"
                    placeholder="R$ 0,00"
                  />
                )}
              </InputMask>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}