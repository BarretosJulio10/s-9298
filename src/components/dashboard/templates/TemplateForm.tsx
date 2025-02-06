import { Form } from "@/components/ui/form";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateFormActions } from "./template-form/TemplateFormActions";
import { useTemplateForm } from "./hooks/useTemplateForm";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubtemplateList } from "./template-form/SubtemplateList";
import { subtemplateTypes } from "./constants/templateTypes";

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
    imageUrl: "" // Adicionado para armazenar URLs de imagens existentes
  }));
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubtemplates = async () => {
      if (!template?.id) return;

      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('parent_id', template.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar subtemplates",
          description: error.message
        });
        return;
      }

      if (data) {
        const updatedSubtemplates = subtemplateTypes.map((type, index) => {
          const subtemplate = data.find(st => st.subtype === type.type);
          return {
            content: subtemplate?.content || "",
            imageFile: null,
            imageUrl: subtemplate?.image_url || "" // Carrega a URL da imagem existente
          };
        });
        setSubtemplates(updatedSubtemplates);
      }
    };

    fetchSubtemplates();
  }, [template?.id, toast]);

  const handleSubmitWithSubtemplates = async (values: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Criar ou atualizar template principal
      const templateData = {
        company_id: user.id,
        name: values.name,
        type: "main",
        content: ""
      };

      let mainTemplate;
      if (template?.id) {
        const { data, error } = await supabase
          .from('message_templates')
          .update(templateData)
          .eq('id', template.id)
          .select()
          .single();

        if (error) throw error;
        mainTemplate = data;
      } else {
        const { data, error } = await supabase
          .from('message_templates')
          .insert(templateData)
          .select()
          .single();

        if (error) throw error;
        mainTemplate = data;
      }

      // Criar ou atualizar subtemplates
      for (let i = 0; i < subtemplateTypes.length; i++) {
        const type = subtemplateTypes[i];
        const subtemplate = subtemplates[i];
        let imageUrl = subtemplate.imageUrl; // Mantém a URL existente se não houver novo arquivo

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

        const subtemplateData = {
          company_id: user.id,
          parent_id: mainTemplate.id,
          content: subtemplate.content || "",
          image_url: imageUrl,
          subtype: type.type,
          name: type.title,
          description: type.description,
          example_message: type.example,
          type: "subtemplate"
        };

        await supabase
          .from('message_templates')
          .upsert(subtemplateData);
      }

      toast({
        title: template?.id ? "Template atualizado com sucesso" : "Template criado com sucesso",
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
      i === index ? { ...st, imageFile: file, imageUrl: "" } : st
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitWithSubtemplates)} className="space-y-4">
        <div className="space-y-2">
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