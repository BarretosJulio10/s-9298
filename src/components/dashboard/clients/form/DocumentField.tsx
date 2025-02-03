import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface DocumentFieldProps {
  form: UseFormReturn<Client>;
}

export function DocumentField({ form }: DocumentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="document"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <InputMask
              mask={field.value.length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
              value={field.value}
              onChange={field.onChange}
            >
              {(inputProps: any) => (
                <Input placeholder="CPF ou CNPJ" {...inputProps} />
              )}
            </InputMask>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}