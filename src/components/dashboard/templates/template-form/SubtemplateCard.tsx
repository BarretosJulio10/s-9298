
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePreview } from "./ImagePreview";
import { TemplateContent } from "./TemplateContent";

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
  return (
    <Card className="mb-4">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-6">
          <TemplateContent
            description={description}
            example={example}
            content={content}
            index={index}
            onContentChange={onContentChange}
          />
          
          <ImagePreview
            imageFile={imageFile}
            imageUrl={imageUrl}
            index={index}
            onImageChange={onImageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
