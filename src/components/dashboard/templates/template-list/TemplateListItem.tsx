import { Button } from "@/components/ui/button";
import { Edit, Trash2, Send } from "lucide-react";

interface Template {
  id: string;
  name: string;
  content: string;
  type: string;
  image_url?: string;
}

interface TemplateListItemProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  onSend: (template: Template) => void;
}

export function TemplateListItem({ 
  template, 
  onEdit, 
  onDelete, 
  onSend 
}: TemplateListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg mb-2">
      <div>
        <h3 className="font-medium">{template.name}</h3>
        <p className="text-sm text-gray-500">{template.type}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSend(template)}
          className="text-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(template)}
          className="text-gray-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(template)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}