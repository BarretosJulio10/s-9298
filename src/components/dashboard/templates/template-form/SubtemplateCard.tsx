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
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-6">
          {/* Coluna da esquerda - Descrição e Textarea */}
          <div className="w-2/3 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-sm text-muted-foreground">Exemplo: {example}</p>
            </div>

            <Textarea
              value={content}
              onChange={(e) => onContentChange(index, e.target.value)}
              placeholder="Digite o conteúdo do template..."
              className="min-h-[120px]"
            />
          </div>
          
          {/* Coluna da direita - Preview da imagem */}
          <div className="w-1/3">
            {hasImage ? (
              <div>
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-md"
                />
                {imageFile && (
                  <span className="text-sm text-muted-foreground block mt-2">
                    {imageFile.name}
                  </span>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-100 rounded-md flex items-center justify-center">
                <ImagePlus className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}