import { Input } from "@/components/ui/input";

interface DateInputProps {
  inputDate: string;
  handleDateInput: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateInput({ inputDate, handleDateInput, placeholder, className }: DateInputProps) {
  return (
    <Input
      value={inputDate}
      onChange={(e) => handleDateInput(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}