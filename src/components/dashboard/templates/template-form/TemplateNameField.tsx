import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../TemplateForm";

interface TemplateNameFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateNameField({ form }: TemplateNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Template</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Lembrete de Pagamento" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}