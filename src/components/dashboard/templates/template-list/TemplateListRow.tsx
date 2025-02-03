import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface TemplateListRowProps {
  template: {
    id: string;
    name: string;
    type: string;
    content: string;
  };
  onEdit: (template: any) => void;
  onDelete: (templateId: string) => void;
  templateTypeTranslations: Record<string, string>;
}

export function TemplateListRow({ 
  template, 
  onEdit, 
  onDelete,
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
            onClick={() => onEdit(template)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(template.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}