import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client>;
}

export function AmountField({ form }: AmountFieldProps) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value ? parseFloat(value) : 0;
    form.setValue('charge_amount', numericValue);
  };

  return (
    <FormField
      control={form.control}
      name="charge_amount"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>Valor da Cobrança</FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">R$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                className="pl-10 text-lg"
                placeholder="0.00"
                onChange={handleAmountChange}
                value={field.value || ''}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}