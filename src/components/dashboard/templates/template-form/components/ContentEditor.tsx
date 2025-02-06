
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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
    } else {
      setShowFieldSuggestions(false);
    }
  };

  const insertField = (fieldName: string) => {
    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    
    onChange(`${beforeCursor}${fieldName}}${afterCursor}`);
    setShowFieldSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Conteúdo da Mensagem</label>
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
          <div className="absolute z-10 w-64 max-h-48 overflow-y-auto bg-white border rounded-md shadow-lg mt-1">
            {templateFields.map((field) => (
              <button
                key={field.name}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                onClick={() => insertField(field.name)}
              >
                <span className="font-medium">{field.display_name}</span>
                <br />
                <span className="text-sm text-gray-500">{field.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
