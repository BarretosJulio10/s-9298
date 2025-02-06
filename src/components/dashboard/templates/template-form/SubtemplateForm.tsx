
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContentEditor } from "./components/ContentEditor";
import { ImageUploader } from "./components/ImageUploader";
import { useTemplateFields } from "./hooks/useTemplateFields";
import { subtemplateTypes, type SubtemplateFormProps } from "./types";

export function SubtemplateForm({ parentId, onComplete }: SubtemplateFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { templateFields } = useTemplateFields();
  const { toast } = useToast();

  const currentTemplate = subtemplateTypes[currentIndex];

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('message_templates')
        .insert({
          company_id: user.id,
          parent_id: parentId,
          content: content || "",
          image_url: imageUrl,
          subtype: currentTemplate.type,
          name: currentTemplate.title,
          description: currentTemplate.description,
          example_message: currentTemplate.example,
          type: "subtemplate"
        });

      if (error) throw error;

      if (currentIndex < subtemplateTypes.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setContent("");
        setImageUrl("");
      } else {
        onComplete();
      }

      toast({
        title: "Template salvo com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar template",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentTemplate.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>{currentTemplate.description}</p>
            <p className="mt-2">Exemplo: {currentTemplate.example}</p>
          </div>

          <ContentEditor
            content={content}
            onChange={setContent}
            templateFields={templateFields}
          />

          <ImageUploader
            imageUrl={imageUrl}
            onImageChange={setImageUrl}
          />

          <div className="flex justify-end gap-2">
            <Button onClick={handleSave}>
              {currentIndex < subtemplateTypes.length - 1 ? "Próximo" : "Concluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
