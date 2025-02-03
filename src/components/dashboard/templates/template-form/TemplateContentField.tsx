import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../TemplateForm";

interface TemplateContentFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateContentField({ form }: TemplateContentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Conteúdo</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Digite o conteúdo da mensagem..."
              className="min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}