import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubtemplateFormProps {
  parentId: string;
  onComplete: () => void;
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
];

export function SubtemplateForm({ parentId, onComplete }: SubtemplateFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const currentTemplate = subtemplateTypes[currentIndex];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('template_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('template_images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
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
    } finally {
      setUploading(false);
    }
  };

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

          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo da Mensagem</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo do template..."
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem do Template</label>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL da imagem"
                className="flex-1"
                readOnly
              />
              <div className="relative">
                <Input
                  type="file"
                  accept="image/png"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative"
                  disabled={uploading}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {uploading ? "Carregando..." : "Upload"}
                </Button>
              </div>
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-[200px] rounded-md"
                />
              </div>
            )}
          </div>

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