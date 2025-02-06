
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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

      onImageChange(publicUrl);
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Imagem do Template</label>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          value={imageUrl}
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
  );
}
