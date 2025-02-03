import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

const timeZone = 'America/Sao_Paulo';

export function useDateField(form: UseFormReturn<Client>) {
  const [inputDate, setInputDate] = useState("");

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/\D/g, "");
    
    if (value.length <= 2) {
      setInputDate(value);
    } else if (value.length <= 4) {
      setInputDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else if (value.length <= 8) {
      setInputDate(`${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`);
    }

    if (value.length === 8) {
      const day = parseInt(value.slice(0, 2));
      const month = parseInt(value.slice(2, 4)) - 1;
      const year = parseInt(value.slice(4));
      
      // Criar a data usando o fuso horário de São Paulo
      const now = new Date();
      const date = new Date(year, month, day, 
        now.getHours(), 
        now.getMinutes(), 
        now.getSeconds()
      );
      
      if (!isNaN(date.getTime())) {
        // Converter para o fuso horário de São Paulo antes de salvar
        const zonedDate = toZonedTime(date, timeZone);
        form.setValue('birth_date', zonedDate.toISOString().split('T')[0]);
      }
    }
  };

  useEffect(() => {
    const date = form.getValues('birth_date');
    if (date) {
      const utcDate = new Date(date);
      // Converter para o fuso horário de São Paulo ao exibir
      const zonedDate = toZonedTime(utcDate, timeZone);
      setInputDate(format(zonedDate, 'dd/MM/yyyy'));
    }
  }, [form.getValues('birth_date')]);

  return {
    inputDate,
    handleDateInput,
  };
}