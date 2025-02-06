import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";

interface SubtemplateCardProps {
  title: string;
  description: string;
  example: string;
  index: number;
  content: string;
  imageFile: File | null;
  imageUrl: string;
  onContentChange: (index: number, content: string) => void;
  onImageChange: (index: number, file: File) => void;
}

export function SubtemplateCard({
  title,
  description,
  example,
  index,
  content,
  imageFile,
  imageUrl,
  onContentChange,
  onImageChange,
}: SubtemplateCardProps) {
  const handleDeleteImage = () => {
    onImageChange(index, null as any);
  };

  const hasImage = imageFile || imageUrl;

  return (
    <Card className="mb-4">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-sm text-muted-foreground">Exemplo: {example}</p>
        </div>
        
        <div className="flex gap-6">
          {/* Coluna da esquerda - Textarea */}
          <div className="flex-1 space-y-2">
            <Textarea
              value={content}
              onChange={(e) => onContentChange(index, e.target.value)}
              placeholder="Digite o conteúdo do template..."
              className="min-h-[200px]"
            />
          </div>

          {/* Coluna da direita - Upload e preview da imagem */}
          <div className="w-[300px] space-y-4">
            {/* Botões de ação */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                id={`image-${index}`}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onImageChange(index, e.target.files[0]);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`image-${index}`)?.click()}
                className="flex items-center gap-2"
              >
                <ImagePlus className="h-4 w-4" />
                {hasImage ? 'Trocar imagem' : 'Upload de imagem'}
              </Button>

              {hasImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteImage}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir imagem
                </Button>
              )}
            </div>

            {/* Nome do arquivo */}
            {imageFile && (
              <span className="text-sm text-muted-foreground block">
                {imageFile.name}
              </span>
            )}

            {/* Preview da imagem */}
            {hasImage && (
              <div className="mt-2">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}