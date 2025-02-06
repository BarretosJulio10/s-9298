
import { useState, useRef, useEffect } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const newPosition = e.target.selectionStart;
    
    onChange(newContent);
    setCursorPosition(newPosition);

    // Mostra sugestões quando o último caractere digitado é "{"
    if (newContent[newPosition - 1] === '{') {
      setShowFieldSuggestions(true);
    }
  };

  const insertField = (fieldName: string) => {
    if (!textareaRef.current) return;

    const beforeCursor = content.slice(0, cursorPosition);
    const afterCursor = content.slice(cursorPosition);
    const newContent = `${beforeCursor}${fieldName}}${afterCursor}`;
    
    onChange(newContent);
    setShowFieldSuggestions(false);

    // Reposiciona o cursor após o campo inserido
    const newCursorPosition = cursorPosition + fieldName.length + 1;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  // Fecha as sugestões quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowFieldSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Agrupar campos por categoria
  const groupedFields = templateFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, TemplateField[]>);

  const updateCursorPosition = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  return (
    <div className="space-y-4">
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
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowFieldSuggestions(false);
              }
            }}
            onSelect={updateCursorPosition}
            onClick={updateCursorPosition}
            onFocus={updateCursorPosition}
            placeholder="Digite o conteúdo do template... Use { para ver os campos disponíveis"
            className="min-h-[150px]"
          />
          {showFieldSuggestions && (
            <div className="absolute z-10 w-72 max-h-80 overflow-y-auto bg-white border rounded-md shadow-lg mt-1 left-0">
              {Object.entries(groupedFields).map(([category, fields]) => (
                <div key={category} className="p-2">
                  <h3 className="text-sm font-semibold text-gray-600 capitalize mb-2 px-2">
                    {category}
                  </h3>
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      className="w-full text-left hover:bg-gray-100 focus:outline-none rounded-md p-2"
                      onClick={() => insertField(field.name)}
                    >
                      <span className="font-medium">{field.display_name}</span>
                      {field.description && (
                        <span className="block text-sm text-gray-500">{field.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Campos Disponíveis:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-600 capitalize">{category}</h4>
              <div className="space-y-1">
                {fields.map((field) => (
                  <div key={field.id} className="text-sm">
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                      {'{' + field.name + '}'}
                    </code>
                    <span className="text-gray-600 ml-2">{field.display_name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
