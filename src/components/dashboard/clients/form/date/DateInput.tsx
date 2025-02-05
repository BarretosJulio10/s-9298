import { Input } from "@/components/ui/input";

export interface DateInputProps {
  inputDate: string;
  handleDateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function DateInput({ inputDate, handleDateInput, placeholder, className }: DateInputProps) {
  return (
    <Input
      value={inputDate}
      onChange={handleDateInput}
      placeholder={placeholder}
      className={className}
    />
  );
}