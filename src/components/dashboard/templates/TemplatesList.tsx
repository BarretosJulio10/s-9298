
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateCard } from "./template-list/TemplateCard";
import { TemplateForm } from "./template-form/TemplateForm";

interface Template {
  id: string;
  name: string;
  type: string;
  content: string;
  created_at: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Lembrete de Pagamento",
    type: "payment_reminder",
    content: "Olá {nome}, sua fatura no valor de {valor} vence em {vencimento}.",
    created_at: "2024-03-20"
  },
  {
    id: "2",
    name: "Confirmação de Pagamento",
    type: "payment_confirmation",
    content: "Obrigado {nome}! Recebemos seu pagamento de {valor}.",
    created_at: "2024-03-19"
  }
];

export function TemplatesList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Templates de Mensagem</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {showForm ? (
        <TemplateForm onCancel={handleFormClose} template={selectedTemplate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEdit(template)}
              onDelete={() => handleDelete(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
