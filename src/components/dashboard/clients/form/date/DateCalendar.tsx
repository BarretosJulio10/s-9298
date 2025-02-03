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
      className="bg-white rounded-md border shadow-sm p-3"
      disabled={(date) => date < new Date("1900-01-01")}
      fromDate={new Date("1900-01-01")}
      captionLayout="dropdown-buttons"
      showOutsideDays={false}
      classNames={{
        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
        day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-gray-100 cursor-pointer",
      }}
      modifiers={{
        selected: (date) => selected ? date.getTime() === selected.getTime() : false
      }}
    />
  );
}