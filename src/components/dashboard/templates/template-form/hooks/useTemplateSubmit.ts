import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { subtemplateTypes } from "../../constants/templateTypes";

interface SubtemplateState {
  content: string;
  imageFile: File | null;
  imageUrl: string;
}

export function useTemplateSubmit() {
  const { toast } = useToast();

  const handleSubmit = async (
    mainTemplate: { id: string },
    subtemplates: SubtemplateState[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      for (let i = 0; i < subtemplateTypes.length; i++) {
        const type = subtemplateTypes[i];
        const subtemplate = subtemplates[i];
        let imageUrl = subtemplate.imageUrl;

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
        title: "Template salvo com sucesso",
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar templates",
        description: error.message
      });
      return false;
    }
  };

  return { handleSubmit };
}