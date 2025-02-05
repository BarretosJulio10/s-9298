import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DateInput } from "./date/DateInput";
import { UseFormReturn } from "react-hook-form";
import { useDateField } from "./date/useDateField";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface BirthDateFieldProps {
  form: UseFormReturn<Client>;
}

export function BirthDateField({ form }: BirthDateFieldProps) {
  const { inputDate, handleDateInput } = useDateField(form);

  return (
    <FormField
      control={form.control}
      name="birth_date"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <DateInput
              inputDate={inputDate}
              handleDateInput={handleDateInput}
              placeholder="Data de Início da Cobrança"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}