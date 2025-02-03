import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../hooks/useTemplateForm";

interface TemplateTypeFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateTypeField({ form }: TemplateTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment_reminder">Lembrete de Pagamento</SelectItem>
                <SelectItem value="payment_confirmation">Confirmação de Pagamento</SelectItem>
                <SelectItem value="late_payment">Pagamento Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}