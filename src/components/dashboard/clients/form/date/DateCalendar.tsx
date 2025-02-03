import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface DateCalendarProps {
  value?: string;
  onSelect: (date: Date | undefined) => void;
}

export function DateCalendar({ value, onSelect }: DateCalendarProps) {
  const selected = value ? new Date(value) : undefined;

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => onSelect(date)}
      locale={ptBR}
      initialFocus
      className="bg-white"
    />
  );
}