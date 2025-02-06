
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { TemplateField } from "../types";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  templateFields: TemplateField[];
}

export function ContentEditor({ content, onChange, templateFields }: ContentEditorProps) {
  const [showFieldSuggestions, setShowFieldSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const newPosition = e.target.selectionStart;
    
    onChange(newContent);
    setCursorPosition(newPosition);

    if (newContent[newPosition - 1] === '{') {
      setShowFieldSuggestions(true);
    }
  };

  const insertField = (fieldName: string) => {
    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    
    onChange(`${beforeCursor}${fieldName}}${afterCursor}`);
    setShowFieldSuggestions(false);
  };

  // Agrupar campos por categoria
  const groupedFields = templateFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Conteúdo da Mensagem</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFieldSuggestions(!showFieldSuggestions)}
        >
          Mostrar Campos Disponíveis
        </Button>
      </div>
      <div className="relative">
        <Textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={(e) => {
            if (e.key === '{') {
              setShowFieldSuggestions(true);
            }
          }}
          placeholder="Digite o conteúdo do template... Use { para ver os campos disponíveis"
          className="min-h-[150px]"
        />
        {showFieldSuggestions && (
          <div className="absolute z-10 w-72 max-h-80 overflow-y-auto bg-white border rounded-md shadow-lg mt-1 right-0">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="p-2">
                <h3 className="text-sm font-semibold text-gray-600 capitalize mb-2 px-2">
                  {category}
                </h3>
                {fields.map((field) => (
                  <button
                    key={field.name}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none rounded-md"
                    onClick={() => insertField(field.name)}
                  >
                    <span className="font-medium">{field.display_name}</span>
                    <br />
                    <span className="text-sm text-gray-500">{field.description}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
