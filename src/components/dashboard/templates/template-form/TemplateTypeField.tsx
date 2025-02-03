import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../hooks/useTemplateForm";

const templateTypes = [
  { value: "payment_reminder", label: "Lembrete de Pagamento" },
  { value: "payment_confirmation", label: "Confirmação de Pagamento" },
  { value: "payment_overdue", label: "Pagamento Atrasado" },
  { value: "welcome", label: "Boas-vindas" },
  { value: "general", label: "Geral" }
];

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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {templateTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}