import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  image_url: z.string().optional(),
  company_id: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export function useTemplateForm() {
  const { toast } = useToast();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("message_templates")
        .insert({
          ...data,
          company_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Template salvo",
        description: "O template foi salvo com sucesso",
      });

      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar template",
        description: error.message,
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}