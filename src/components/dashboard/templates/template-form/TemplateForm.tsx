
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { templateTypeTranslations } from "../constants/templateTypes";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório")
});

interface TemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  } | null;
  onCancel: () => void;
}

export function TemplateForm({ template, onCancel }: TemplateFormProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      type: template?.type || "",
      content: template?.content || ""
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Template</label>
            <Input
              {...form.register("name")}
              placeholder="Ex: Lembrete de Pagamento"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo do Template</label>
            <Select 
              value={form.watch("type")} 
              onValueChange={(value) => form.setValue("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templateTypeTranslations).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo da Mensagem</label>
            <Textarea
              {...form.register("content")}
              placeholder="Digite o conteúdo do template..."
              className="min-h-[150px]"
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Você pode usar variáveis como {"{nome}"}, {"{valor}"}, {"{vencimento}"} no conteúdo.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {template ? "Atualizar Template" : "Criar Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
