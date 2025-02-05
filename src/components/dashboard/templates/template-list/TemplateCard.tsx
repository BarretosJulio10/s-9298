import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { templateTypeTranslations } from "../constants/templateTypes";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    type: keyof typeof templateTypeTranslations;
    content: string;
    created_at: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <Badge variant="secondary">
              {templateTypeTranslations[template.type]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 line-clamp-3">{template.content}</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-primary"
          title="Enviar mensagem"
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEdit}
          className="text-primary"
          title="Editar template"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Excluir template"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}