import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubtemplateList } from "./template-form/SubtemplateList";

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
  const { form, onSubmit, isSubmitting } = useTemplateForm({ template, onCancel });
  const [subtemplates, setSubtemplates] = useState(Array(3).fill({
    content: "",
    imageFile: null as File | null,
  }));
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

  const handleContentChange = (index: number, content: string) => {
    setSubtemplates(prev => prev.map((st, i) => 
      i === index ? { ...st, content } : st
    ));
  };

  const handleImageChange = (index: number, file: File) => {
    setSubtemplates(prev => prev.map((st, i) => 
      i === index ? { ...st, imageFile: file } : st
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithSubtemplates)} className="space-y-6">
        <div className="space-y-4">
          <TemplateNameField form={form} />
        </div>

        <SubtemplateList
          subtemplates={subtemplates}
          onContentChange={handleContentChange}
          onImageChange={handleImageChange}
        />

        <TemplateFormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isEditing={!!template}
        />
      </form>
    </Form>
  );
}