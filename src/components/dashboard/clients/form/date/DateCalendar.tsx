import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface DateCalendarProps {
  value?: string;
  onSelect: (date: Date | undefined) => void;
}

export function DateCalendar({ value, onSelect }: DateCalendarProps) {
  const selected = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure we're working with a proper Date object
      const selectedDate = new Date(date);
      onSelect(selectedDate);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      locale={ptBR}
      initialFocus
      className="bg-white"
      disabled={(date) => date < new Date("1900-01-01")}
    />
  );
}