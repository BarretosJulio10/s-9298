import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TemplateCard } from "./template-list/TemplateCard";
import { TemplateForm } from "./TemplateForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function TemplatesList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { toast } = useToast();

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .eq("company_id", user.id)
        .is("parent_id", null);

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (templateId: string) => {
    try {
      // Primeiro deleta os subtemplates
      await supabase
        .from("message_templates")
        .delete()
        .eq("parent_id", templateId);

      // Depois deleta o template principal
      await supabase
        .from("message_templates")
        .delete()
        .eq("id", templateId);

      toast({
        title: "Template excluído com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir template",
        description: error.message,
      });
    }
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
          {templates?.map((template) => (
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