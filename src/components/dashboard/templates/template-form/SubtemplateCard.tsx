import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface SubtemplateCardProps {
  title: string;
  description: string;
  example: string;
  index: number;
  content: string;
  imageFile: File | null;
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
  onContentChange,
  onImageChange,
}: SubtemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground">Exemplo: {example}</p>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Conteúdo da Mensagem</label>
          <Textarea
            value={content}
            onChange={(e) => onContentChange(index, e.target.value)}
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
                  onImageChange(index, e.target.files[0]);
                }
              }}
              className="cursor-pointer"
            />
          </div>
          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="max-w-[200px] rounded-md"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}