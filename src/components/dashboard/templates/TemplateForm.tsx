import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

      if (template?.id) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="payment_reminder">Lembrete de Pagamento</SelectItem>
                  <SelectItem value="payment_confirmation">Confirmação de Pagamento</SelectItem>
                  <SelectItem value="late_payment">Pagamento Atrasado</SelectItem>
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

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {template ? "Atualizar" : "Criar"} Template
          </Button>
        </div>
      </form>
    </Form>
  );
}