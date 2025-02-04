import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TemplateListHeader } from "./template-list/TemplateListHeader";
import { TemplateListRow } from "./template-list/TemplateListRow";
import { DeleteTemplateDialog } from "./template-list/DeleteTemplateDialog";
import { EditTemplateDialog } from "./template-list/EditTemplateDialog";
import { SendNotificationDialog } from "./SendNotificationDialog";
import { templateTypeTranslations } from "./constants/templateTypes";
import { TemplateForm } from "./TemplateForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TemplatesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [sendingTemplate, setSendingTemplate] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Template excluído",
        description: "O template foi excluído com sucesso",
      });
      setTemplateToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir template",
        description: error.message,
      });
    },
  });

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Novo Template</h1>
          <p className="text-muted-foreground">
            Crie um novo template para suas mensagens
          </p>
        </div>
        <TemplateForm onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando templates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Gerencie suas cobranças e acompanhe seus resultados
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TemplateListHeader />
          <TableBody>
            {templates?.map((template) => (
              <TemplateListRow
                key={template.id}
                template={template}
                onEdit={setEditingTemplate}
                onDelete={setTemplateToDelete}
                onSend={setSendingTemplate}
                templateTypeTranslations={templateTypeTranslations}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EditTemplateDialog
        open={editingTemplate !== null}
        onOpenChange={(open) => !open && setEditingTemplate(null)}
        template={editingTemplate}
      />

      <DeleteTemplateDialog
        open={templateToDelete !== null}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        onConfirm={() => templateToDelete && deleteTemplate.mutate(templateToDelete)}
      />

      <SendNotificationDialog
        open={sendingTemplate !== null}
        onOpenChange={(open) => !open && setSendingTemplate(null)}
        template={sendingTemplate}
      />
    </div>
  );
}