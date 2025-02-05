import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
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
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      toast({
        title: template ? "Template atualizado" : "Template criado",
      });
      
      queryClient.invalidateQueries({
        queryKey: ["templates"]
      });
      
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