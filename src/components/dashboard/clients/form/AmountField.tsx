import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client & { amount?: number }>;
}

export function AmountField({ form }: AmountFieldProps) {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                R$
              </span>
              <Input 
                type="number"
                step="0.01"
                min="0"
                className="pl-10 text-lg h-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}