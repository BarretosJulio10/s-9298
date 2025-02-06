import { subtemplateTypes } from "../constants/templateTypes";
import { SubtemplateCard } from "./SubtemplateCard";
import { Separator } from "@/components/ui/separator";

interface SubtemplateListProps {
  subtemplates: Array<{
    content: string;
    imageFile: File | null;
    imageUrl: string;
  }>;
  onContentChange: (index: number, content: string) => void;
  onImageChange: (index: number, file: File) => void;
}

export function SubtemplateList({
  subtemplates,
  onContentChange,
  onImageChange,
}: SubtemplateListProps) {
  return (
    <div className="space-y-6">
      <Separator className="my-6" />
      <h3 className="text-lg font-semibold">Subtemplates</h3>
      
      {subtemplateTypes.map((type, index) => (
        <SubtemplateCard
          key={type.type}
          title={type.title}
          description={type.description}
          example={type.example}
          index={index}
          content={subtemplates[index].content}
          imageFile={subtemplates[index].imageFile}
          imageUrl={subtemplates[index].imageUrl}
          onContentChange={onContentChange}
          onImageChange={onImageChange}
        />
      ))}
    </div>
  );
}