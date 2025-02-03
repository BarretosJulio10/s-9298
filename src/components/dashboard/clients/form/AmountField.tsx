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
    const value = event.target.value
      .replace(/\D/g, '')
      .replace(/^0+/, '');
    
    const numericValue = value ? Number(value) / 100 : 0;
    form.setValue('charge_amount', numericValue);
  };

  const formatAmount = (value: number | undefined) => {
    if (!value && value !== 0) return '';
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).replace('R$', '').trim();
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