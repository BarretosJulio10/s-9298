import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateTypeField } from "./template-form/TemplateTypeField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { TemplateContentField } from "./template-form/TemplateContentField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    imageUrl: "",
    uploading: false
  })));
  const { toast } = useToast();

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      if (!file.type.includes('image/png')) {
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: "Por favor, selecione apenas arquivos PNG."
        });
        return;
      }

      setSubtemplates(prev => prev.map((st, i) => 
        i === index ? { ...st, uploading: true } : st
      ));

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('template_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('template_images')
        .getPublicUrl(filePath);

      setSubtemplates(prev => prev.map((st, i) => 
        i === index ? { ...st, imageUrl: publicUrl, uploading: false } : st
      ));

      toast({
        title: "Imagem carregada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer upload da imagem",
        description: error.message,
      });
      setSubtemplates(prev => prev.map((st, i) => 
        i === index ? { ...st, uploading: false } : st
      ));
    }
  };

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
          type: values.type,
          content: values.content || "",
        })
        .select()
        .single();

      if (mainError) throw mainError;

      // Criar subtemplates
      const subtemplatePromises = subtemplateTypes.map((type, index) => 
        supabase
          .from('message_templates')
          .insert({
            company_id: user.id,
            parent_id: mainTemplate.id,
            content: subtemplates[index].content || "",
            image_url: subtemplates[index].imageUrl,
            subtype: type.type,
            name: type.title,
            description: type.description,
            example_message: type.example,
            type: "subtemplate"
          })
      );

      await Promise.all(subtemplatePromises);

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
          <TemplateTypeField form={form} />
          <TemplateContentField form={form} />
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
                      type="text"
                      value={subtemplates[index].imageUrl}
                      readOnly
                      placeholder="URL da imagem"
                      className="flex-1"
                    />
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/png"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={subtemplates[index].uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="relative"
                        disabled={subtemplates[index].uploading}
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        {subtemplates[index].uploading ? "Carregando..." : "Upload"}
                      </Button>
                    </div>
                  </div>
                  {subtemplates[index].imageUrl && (
                    <div className="mt-2">
                      <img
                        src={subtemplates[index].imageUrl}
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