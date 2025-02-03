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
      styles={{
        day: { 
          cursor: 'pointer',
          margin: '2px',
          width: '35px',
          height: '35px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: '#e5e7eb'
          }
        }
      }}
    />
  );
}