
import { Textarea } from "@/components/ui/textarea";

interface TemplateContentProps {
  description: string;
  example: string;
  content: string;
  index: number;
  onContentChange: (index: number, content: string) => void;
}

export function TemplateContent({
  description,
  example,
  content,
  index,
  onContentChange,
}: TemplateContentProps) {
  return (
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
  );
}
