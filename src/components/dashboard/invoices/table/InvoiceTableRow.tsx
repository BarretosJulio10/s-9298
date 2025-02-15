
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Send, Trash2 } from "lucide-react";
import { Invoice } from "../types/Invoice";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAppropriateTemplate } from "@/lib/templateSelection";
import { sendMessage } from "@/lib/wapi/sendMessage";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
}

export function InvoiceTableRow({ 
  invoice, 
  onEdit, 
  onDelete, 
  onSend 
}: InvoiceTableRowProps) {
  const { toast } = useToast();

  const handleSendInvoice = useCallback(async () => {
    try {
      // 1. Verificar se existe instância ativa do WhatsApp
      const { data: instance, error: instanceError } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('status', 'connected')
        .single();

      if (instanceError || !instance) {
        toast({
          variant: "destructive",
          title: "Erro ao enviar fatura",
          description: "Nenhuma instância do WhatsApp conectada. Por favor, configure o WhatsApp primeiro.",
        });
        return;
      }

      // 2. Buscar cliente e seu template associado
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select(`
          *,
          message_templates (
            id,
            content,
            image_url
          )
        `)
        .eq('id', invoice.client.id)
        .single();

      if (clientError || !client) {
        toast({
          variant: "destructive",
          title: "Erro ao enviar fatura",
          description: "Cliente não encontrado.",
        });
        return;
      }

      // Obter o perfil da empresa
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) throw new Error("Perfil da empresa não encontrado");

      // 3. Se não tiver template específico, busca o template padrão
      let template = client.message_templates;
      if (!template) {
        template = await getAppropriateTemplate(
          "invoice",
          invoice.due_date,
          invoice.status,
          invoice.id
        );
      }

      if (!template) {
        toast({
          variant: "destructive",
          title: "Erro ao enviar fatura",
          description: "Template de mensagem não encontrado.",
        });
        return;
      }

      // 4. Preparar a mensagem
      const message = template.content
        .replace('{nome}', client.name)
        .replace('{valor}', new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(invoice.amount))
        .replace('{vencimento}', new Date(invoice.due_date).toLocaleDateString('pt-BR'))
        .replace('{codigo}', invoice.code);

      // 5. Enviar a mensagem com imagem se disponível
      await sendMessage({
        phone: client.phone,
        message,
        instanceId: instance.connection_key,
        imageUrl: template.image_url,
        clientId: client.id,
        invoiceId: invoice.id,
        companyId: profile.id
      });

      toast({
        title: "Sucesso",
        description: "Fatura enviada com sucesso via WhatsApp.",
      });

    } catch (error) {
      console.error('Erro ao enviar fatura:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar fatura",
        description: error instanceof Error ? error.message : "Erro ao enviar fatura via WhatsApp.",
      });
    }
  }, [invoice, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <TableRow className="even:bg-gray-50">
      <TableCell className="font-medium">{invoice.code}</TableCell>
      <TableCell>{invoice.client?.name || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.email || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.document || 'N/A'}</TableCell>
      <TableCell>{invoice.client?.phone || 'N/A'}</TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(invoice.amount)}
      </TableCell>
      <TableCell>
        {new Date(invoice.due_date).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSendInvoice}
            title="Enviar fatura"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(invoice)}
            title="Editar fatura"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(invoice)}
            className="text-destructive hover:text-destructive"
            title="Excluir fatura"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
