import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { DateInput } from "./date/DateInput";
import { DateCalendar } from "./date/DateCalendar";
import { useDateField } from "./date/useDateField";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface BirthDateFieldProps {
  form: UseFormReturn<Client>;
}

const timeZone = 'America/Sao_Paulo';

export function BirthDateField({ form }: BirthDateFieldProps) {
  const { inputDate, handleDateInput } = useDateField(form, timeZone);

  return (
    <FormField
      control={form.control}
      name="birth_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Início da Cobrança</FormLabel>
          <div className="flex gap-2">
            <DateInput 
              inputDate={inputDate} 
              handleDateInput={handleDateInput} 
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-2",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DateCalendar
                  value={field.value}
                  timeZone={timeZone}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date.toISOString().split('T')[0]);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}