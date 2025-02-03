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
      modifiersStyles={{
        selected: {
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '4px'
        }
      }}
      modifiers={{
        selected: (date) => selected ? date.getTime() === selected.getTime() : false
      }}
      classNames={{
        day: "cursor-pointer m-0.5 w-9 h-9 p-0 font-normal aria-selected:bg-primary aria-selected:text-primary-foreground hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
      }}
    />
  );
}