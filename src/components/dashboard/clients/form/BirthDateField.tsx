import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface BirthDateFieldProps {
  form: UseFormReturn<Client>;
}

export function BirthDateField({ form }: BirthDateFieldProps) {
  const [inputDate, setInputDate] = useState("");

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputDate(value);

    // Verifica se o input está no formato dd/mm/aaaa
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      
      // Verifica se a data é válida
      if (!isNaN(date.getTime())) {
        form.setValue('birth_date', date);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="birth_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Início da Cobrança</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="dd/mm/aaaa"
              value={inputDate}
              onChange={handleDateInput}
              className="w-full"
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
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    if (date) {
                      setInputDate(format(date, 'dd/MM/yyyy'));
                    }
                  }}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                  locale={ptBR}
                  className="bg-white border rounded-md"
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