import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Send, Pencil, Trash2, Link } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ClientActionsProps {
  client: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
    charge_amount: number;
  };
  onEdit: () => void;
  onSend: () => void;
  paymentLink?: string | null;
}

export function ClientActions({ client, onEdit, onSend, paymentLink }: ClientActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      // Primeiro, exclui as cobranças pendentes do cliente
      const { error: chargesError } = await supabase
        .from("client_charges")
        .delete()
        .eq("client_id", client.id)
        .eq("status", "pending");

      if (chargesError) throw chargesError;

      // Em seguida, exclui o cliente
      const { error: clientError } = await supabase
        .from("clients")
        .delete()
        .eq("id", client.id);

      if (clientError) throw clientError;

      // Atualiza a lista de clientes e cobranças
      queryClient.invalidateQueries({ queryKey: ["clients-with-charges"] });

      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description:
          "Ocorreu um erro ao excluir o cliente. Por favor, tente novamente.",
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleCopyLink = async () => {
    if (!paymentLink) {
      toast({
        variant: "destructive",
        title: "Link não disponível",
        description: "Não há link de pagamento disponível para este cliente.",
      });
      return;
    }

    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "Link copiado",
      description: "O link de pagamento foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSend}
        title="Enviar mensagem"
      >
        <Send className="h-4 w-4" />
      </Button>

      {paymentLink && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          title="Copiar link"
        >
          <Link className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title="Editar cliente"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDeleteDialog(true)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        title="Excluir cliente"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser
              desfeita. As cobranças pagas serão mantidas como histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}