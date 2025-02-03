import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface BirthDateFieldProps {
  form: UseFormReturn<Client>;
}

const timeZone = 'America/Sao_Paulo';

export function BirthDateField({ form }: BirthDateFieldProps) {
  const [inputDate, setInputDate] = useState("");

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, "");
    
    // Aplica a máscara dd/mm/aaaa
    if (value.length <= 2) {
      setInputDate(value);
    } else if (value.length <= 4) {
      setInputDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else if (value.length <= 8) {
      setInputDate(`${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`);
    }

    // Se tiver 8 dígitos (data completa), converte para Date
    if (value.length === 8) {
      const day = parseInt(value.slice(0, 2));
      const month = parseInt(value.slice(2, 4)) - 1;
      const year = parseInt(value.slice(4));
      
      // Cria a data no fuso horário de São Paulo
      const date = new Date(year, month, day);
      const zonedDate = zonedTimeToUtc(date, timeZone);

      // Verifica se é uma data válida
      if (!isNaN(date.getTime())) {
        form.setValue('birth_date', zonedDate.toISOString().split('T')[0]);
      }
    }
  };

  // Atualiza o input quando a data é selecionada pelo calendário
  useEffect(() => {
    const date = form.getValues('birth_date');
    if (date) {
      const utcDate = new Date(date);
      const zonedDate = utcToZonedTime(utcDate, timeZone);
      setInputDate(format(zonedDate, 'dd/MM/yyyy'));
    }
  }, [form.getValues('birth_date')]);

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
              maxLength={10}
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
                  selected={field.value ? utcToZonedTime(new Date(field.value), timeZone) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const zonedDate = zonedTimeToUtc(date, timeZone);
                      field.onChange(zonedDate.toISOString().split('T')[0]);
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