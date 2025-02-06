
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ChargeFrequencyFieldProps {
  form: UseFormReturn<any>;
}

export function ChargeFrequencyField({ form }: ChargeFrequencyFieldProps) {
  return (
    <FormField
      control={form.control}
      name="charge_frequency"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger 
                className={`${
                  field.value 
                    ? "bg-primary text-white hover:bg-primary/90" 
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <SelectValue placeholder="Frequência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="biweekly">Quinzenal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
