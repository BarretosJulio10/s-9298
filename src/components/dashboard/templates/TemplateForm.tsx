import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TemplateFormProps {
  template?: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onCancel: () => void;
}

const subtemplateTypes = [
  {
    type: "notification" as const,
    title: "Template de Notificação",
    description: "Enviado quando uma nova cobrança é gerada",
    example: "Olá {nome}, sua fatura no valor de {valor} vence em {vencimento}."
  },
  {
    type: "delayed" as const,
    title: "Template de Atraso",
    description: "Enviado quando uma cobrança está atrasada",
    example: "Olá {nome}, sua fatura no valor de {valor} está vencida desde {vencimento}."
  },
  {
    type: "paid" as const,
    title: "Template de Pagamento",
    description: "Enviado quando um pagamento é confirmado",
    example: "Olá {nome}, confirmamos o pagamento da sua fatura no valor de {valor}."
  }
] as const;

export function TemplateForm({ template, onCancel }: TemplateFormProps) {
  const { form, onSubmit, isSubmitting } = useTemplateForm({ template, onCancel });
  const [subtemplates, setSubtemplates] = useState(subtemplateTypes.map(() => ({
    content: "",
    imageFile: null as File | null,
    uploading: false
  })));
  const { toast } = useToast();

  const handleSubmitWithSubtemplates = async (values: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Criar template principal
      const { data: mainTemplate, error: mainError } = await supabase
        .from('message_templates')
        .insert({
          company_id: user.id,
          name: values.name,
          type: "main",
          content: ""
        })
        .select()
        .single();

      if (mainError) throw mainError;

      // Criar subtemplates
      for (let i = 0; i < subtemplateTypes.length; i++) {
        const type = subtemplateTypes[i];
        const subtemplate = subtemplates[i];
        let imageUrl = "";

        if (subtemplate.imageFile) {
          const fileExt = subtemplate.imageFile.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('template_images')
            .upload(filePath, subtemplate.imageFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('template_images')
            .getPublicUrl(filePath);

          imageUrl = publicUrl;
        }

        await supabase
          .from('message_templates')
          .insert({
            company_id: user.id,
            parent_id: mainTemplate.id,
            content: subtemplate.content || "",
            image_url: imageUrl,
            subtype: type.type,
            name: type.title,
            description: type.description,
            example_message: type.example,
            type: "subtemplate"
          });
      }

      toast({
        title: "Template criado com sucesso",
        description: "Template e subtemplates foram salvos"
      });

      onCancel();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar templates",
        description: error.message
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithSubtemplates)} className="space-y-6">
        <div className="space-y-4">
          <TemplateNameField form={form} />
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Subtemplates</h3>
          
          {subtemplateTypes.map((type, index) => (
            <Card key={type.type}>
              <CardHeader>
                <CardTitle>{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{type.description}</p>
                <p className="text-sm text-muted-foreground">Exemplo: {type.example}</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Conteúdo da Mensagem</label>
                  <Textarea
                    value={subtemplates[index].content}
                    onChange={(e) => setSubtemplates(prev => prev.map((st, i) => 
                      i === index ? { ...st, content: e.target.value } : st
                    ))}
                    placeholder="Digite o conteúdo do template..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Imagem do Template</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSubtemplates(prev => prev.map((st, i) => 
                            i === index ? { ...st, imageFile: e.target.files![0] } : st
                          ));
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  {subtemplates[index].imageFile && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(subtemplates[index].imageFile)}
                        alt="Preview"
                        className="max-w-[200px] rounded-md"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <TemplateFormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!template}
        />
      </form>
    </Form>
  );
}