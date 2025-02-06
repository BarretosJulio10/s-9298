
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem } from "@/components/ui/form";
import { templateTypeTranslations } from "../../templates/constants/templateTypes";

export function TemplateField({ form }: { form: any }) {
  const { data: templates } = useQuery({
    queryKey: ["message-templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Busca apenas os templates principais (sem parent_id)
      const { data: parentTemplates, error: parentError } = await supabase
        .from("message_templates")
        .select("*")
        .eq("company_id", user.id)
        .is("parent_id", null);

      if (parentError) throw parentError;
      return parentTemplates;
    },
  });

  const handleTemplateChange = async (templateId: string) => {
    form.setValue("template_id", templateId);

    // Quando um template é selecionado, salvamos também o template principal para referência
    form.setValue("parent_template_id", templateId);
  };

  return (
    <FormField
      control={form.control}
      name="template_id"
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={handleTemplateChange} value={field.value}>
            <SelectTrigger className="text-muted-foreground">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name} ({templateTypeTranslations[template.type as keyof typeof templateTypeTranslations]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
