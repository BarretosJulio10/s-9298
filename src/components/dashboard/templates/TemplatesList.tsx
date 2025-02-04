import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TemplateForm } from "./TemplateForm";
import { SendNotificationDialog } from "./SendNotificationDialog";
import { TemplateListHeader } from "./template-list/TemplateListHeader";
import { TemplateListItem } from "./template-list/TemplateListItem";

interface Template {
  id: string;
  name: string;
  content: string;
  type: string;
  image_url?: string;
}

export function TemplatesList() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const { data: templates, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Template[];
    },
  });

  const handleDelete = async (template: Template) => {
    try {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", template.id);

      if (error) throw error;

      toast({
        title: "Template excluído",
        description: "O template foi excluído com sucesso",
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template",
      });
    }
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleSend = (template: Template) => {
    setSelectedTemplate(template);
    setShowSendDialog(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTemplate(null);
    refetch();
  };

  if (!session?.user?.id) return null;

  return (
    <div className="space-y-4">
      <TemplateListHeader onNewTemplate={() => setShowForm(true)} />
      
      <div className="space-y-2">
        {templates?.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSend={handleSend}
          />
        ))}
      </div>

      {showForm && (
        <TemplateForm
          template={selectedTemplate}
          onClose={handleFormClose}
        />
      )}

      {showSendDialog && selectedTemplate && (
        <SendNotificationDialog
          template={selectedTemplate}
          onClose={() => {
            setShowSendDialog(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}