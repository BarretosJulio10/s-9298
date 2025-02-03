import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../hooks/useTemplateForm";
import { templateTypeTranslations } from "../constants/templateTypes";

interface TemplateTypeFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateTypeField({ form }: TemplateTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Tipo do Template</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo do template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(templateTypeTranslations).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
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