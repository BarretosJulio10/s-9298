import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

interface DateCalendarProps {
  value: string | undefined;
  timeZone: string;
  onSelect: (date: Date | undefined) => void;
}

export function DateCalendar({ value, timeZone, onSelect }: DateCalendarProps) {
  return (
    <Calendar
      mode="single"
      selected={value ? toZonedTime(new Date(value), timeZone) : undefined}
      onSelect={(date) => {
        if (date) {
          const zonedDate = fromZonedTime(date, timeZone);
          onSelect(zonedDate);
        } else {
          onSelect(undefined);
        }
      }}
      disabled={(date) => date < new Date()}
      initialFocus
      locale={ptBR}
      className="bg-white border rounded-md"
    />
  );
}