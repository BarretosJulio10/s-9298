import { useState, useEffect } from "react";
import { format, parse, addDays } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

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
      
      const date = new Date(year, month, day);
      
      if (!isNaN(date.getTime())) {
        // Adiciona um dia à data antes de salvar
        const adjustedDate = addDays(date, 1);
        form.setValue('birth_date', adjustedDate.toISOString().split('T')[0]);
      }
    }
  };

  useEffect(() => {
    const date = form.getValues('birth_date');
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        // Subtrai um dia ao exibir para compensar o ajuste feito ao salvar
        const displayDate = addDays(parsedDate, -1);
        setInputDate(format(displayDate, 'dd/MM/yyyy'));
      }
    }
  }, [form.getValues('birth_date')]);

  return {
    inputDate,
    handleDateInput,
  };
}