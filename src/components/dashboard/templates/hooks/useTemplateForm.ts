import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export type TemplateFormData = z.infer<typeof templateSchema>;

interface UseTemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onCancel: () => void;
}

export function useTemplateForm({ template, onCancel }: UseTemplateFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || "",
      type: template?.type || "",
      content: template?.content || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TemplateFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (template?.id) {
        const { error } = await supabase
          .from("message_templates")
          .update({
            name: values.name,
            type: values.type,
            content: values.content,
          })
          .eq("id", template.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("message_templates")
          .insert({
            company_id: user.id,
            name: values.name,
            type: values.type,
            content: values.content,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: template ? "Template atualizado" : "Template criado",
        description: template
          ? "O template foi atualizado com sucesso"
          : "O template foi criado com sucesso",
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar template",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: TemplateFormData) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  };
}