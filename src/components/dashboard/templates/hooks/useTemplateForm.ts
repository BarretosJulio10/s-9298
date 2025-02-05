import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  content: z.string().optional(),
  image_url: z.string().optional(),
});

export type TemplateFormData = z.infer<typeof templateSchema>;

interface UseTemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
    image_url?: string;
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
      image_url: template?.image_url || "",
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      // Lógica de submissão será implementada aqui
      toast({
        title: template ? "Template atualizado" : "Template criado",
      });
      queryClient.invalidateQueries(["templates"]);
      onCancel();
    } catch (error) {
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