import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface DateInputProps {
  inputDate: string;
  handleDateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DateInput({ inputDate, handleDateInput }: DateInputProps) {
  return (
    <Input
      placeholder="dd/mm/aaaa"
      value={inputDate}
      onChange={handleDateInput}
      maxLength={10}
      className="w-full"
    />
  );
}