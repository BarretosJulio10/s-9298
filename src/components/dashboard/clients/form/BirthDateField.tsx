import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DateInput } from "./date/DateInput";
import { UseFormReturn } from "react-hook-form";

interface BirthDateFieldProps {
  form: UseFormReturn<any>;
}

export function BirthDateField({ form }: BirthDateFieldProps) {
  return (
    <FormField
      control={form.control}
      name="birth_date"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DateInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Data de Início da Cobrança"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}