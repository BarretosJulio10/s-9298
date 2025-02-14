
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Card className="absolute z-10 w-96 max-h-80 overflow-y-auto bg-white border rounded-md shadow-lg mt-1 left-0">
                <div className="p-4 space-y-4">
                  {Object.entries(groupedFields).map(([category, fields]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-600 capitalize">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {fields.map((field) => (
                          <button
                            key={field.id}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors flex flex-col"
                            onClick={() => insertField(field.name)}
                          >
                            <span className="font-medium text-sm">
                              {'{' + field.name + '}'} - {field.display_name}
                            </span>
                            {field.description && (
                              <span className="text-xs text-gray-500">{field.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Exemplos de Uso</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Exemplo de Notificação:</p>
              <p className="text-sm text-gray-600">
                "Olá {'nome'}, sua fatura no valor de {'valor'} vence em {'vencimento'}. Para pagar, acesse: {'link_pagamento'}"
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Exemplo de Atraso:</p>
              <p className="text-sm text-gray-600">
                "Prezado(a) {'nome'}, identificamos que sua fatura de {'valor'} está vencida desde {'vencimento'}."
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Exemplo de Confirmação:</p>
              <p className="text-sm text-gray-600">
                "Confirmamos o pagamento da sua fatura, {'nome'}! Valor: {'valor'}"
              </p>
            </div>
          </div>
        </Card>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Campos Disponíveis:</h3>
          <div className="space-y-3">
            {Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-600 capitalize">{category}</h4>
                <div className="grid gap-2">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                        {'{' + field.name + '}'}
                      </code>
                      <span className="text-sm text-gray-600 ml-2">{field.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
