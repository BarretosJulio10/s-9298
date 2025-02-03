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
      onSelect={onSelect}
      locale={ptBR}
      initialFocus
      className="bg-white rounded-md border shadow-sm"
      disabled={(date) => date < new Date("1900-01-01")}
      fromDate={new Date("1900-01-01")}
      captionLayout="dropdown-buttons"
      showOutsideDays={false}
    />
  );
}