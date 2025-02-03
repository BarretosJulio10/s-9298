import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const templateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onCancel: () => void;
}

export function TemplateForm({ template, onCancel }: TemplateFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template || {
      name: "",
      type: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TemplateFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const templateData = {
        name: values.name,
        type: values.type,
        content: values.content,
        company_id: user.id,
      };

      if (template) {
        const { error } = await supabase
          .from("message_templates")
          .update(templateData)
          .eq("id", template.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("message_templates")
          .insert([templateData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: template ? "Template atualizado" : "Template criado",
        description: template ? "O template foi atualizado com sucesso" : "O template foi criado com sucesso",
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Template</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="reminder">Lembrete</SelectItem>
                  <SelectItem value="overdue">Atraso</SelectItem>
                  <SelectItem value="confirmation">Confirmação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {template ? "Atualizar" : "Criar"} Template
          </Button>
        </div>
      </form>
    </Form>
  );
}