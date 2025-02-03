import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Send } from "lucide-react";

interface TemplateListRowProps {
  template: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onEdit: (template: any) => void;
  onDelete: (templateId: string) => void;
  onSend: (template: any) => void;
  templateTypeTranslations: Record<string, string>;
}

export function TemplateListRow({ 
  template, 
  onEdit, 
  onDelete,
  onSend,
  templateTypeTranslations 
}: TemplateListRowProps) {
  return (
    <TableRow>
      <TableCell>{template.name}</TableCell>
      <TableCell>{templateTypeTranslations[template.type] || template.type}</TableCell>
      <TableCell className="max-w-md truncate">{template.content}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSend(template)}
            title="Enviar mensagem"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(template)}
            title="Editar template"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(template.id)}
            title="Excluir template"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}