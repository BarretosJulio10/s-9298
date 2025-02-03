import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client & { amount?: number }>;
}

export function AmountField({ form }: AmountFieldProps) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/^0+/, ''); // Remove zeros à esquerda
    
    const numericValue = value ? Number(value) / 100 : 0; // Converte para decimal
    form.setValue('amount', numericValue);
  };

  const formatAmount = (value: number | undefined) => {
    if (!value) return '';
    return (value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace('R$', '').trim();
  };

  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem className="w-36">
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                R$
              </span>
              <InputMask
                mask="999.999,99"
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