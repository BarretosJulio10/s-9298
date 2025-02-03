import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../hooks/useTemplateForm";

interface TemplateContentFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateContentField({ form }: TemplateContentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Conteúdo da Mensagem</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Digite o conteúdo do template..."
              className="min-h-[150px] resize-y"
              {...field}
            />
          </FormControl>
          <FormMessage />
          <p className="text-sm text-muted-foreground">
            Você pode usar variáveis como {"{nome}"}, {"{valor}"}, {"{vencimento}"} no conteúdo.
          </p>
        </FormItem>
      )}
    />
  );
}