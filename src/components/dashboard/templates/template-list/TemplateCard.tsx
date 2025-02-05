import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
      <CardHeader className="space-y-1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900">{template.name}</h3>
            <Badge variant="secondary" className="text-xs">
              Principal
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
      </CardContent>
      <CardFooter className="justify-end gap-2 p-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 text-primary"
          title="Editar template"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Excluir template"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}