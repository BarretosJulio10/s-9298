import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Send, FileEdit, ExternalLink, Trash2 } from "lucide-react";
import { ClientStatus } from "./ClientStatus";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientTableRowProps {
  client: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
    code: string;
    charge_amount: number;
    birth_date: string | null;
    paymentStatus?: string;
    paymentLink?: string;
  };
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientTableRow({ client, onSelect, onEdit, onDelete }: ClientTableRowProps) {
  const { toast } = useToast();
  
  const handleRowClick = () => {
    onSelect();
  };

  const handleCopyLink = async () => {
    if (!client.paymentLink) {
      toast({
        variant: "destructive",
        title: "Link não disponível",
        description: "Este cliente ainda não possui um link de pagamento.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(client.paymentLink);
      toast({
        title: "Link copiado!",
        description: "O link de pagamento foi copiado para sua área de transferência.",
      });
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast({
        variant: "destructive",
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link de pagamento.",
      });
    }
  };

  return (
    <TableRow className="even:bg-gray-50">
      <TableCell className="font-medium text-left">
        {client.code}
      </TableCell>
      <TableCell className="font-medium cursor-pointer" onClick={handleRowClick}>
        {client.name}
      </TableCell>
      <TableCell className="text-center">{client.email}</TableCell>
      <TableCell className="text-center">{client.document}</TableCell>
      <TableCell className="text-center">{client.phone}</TableCell>
      <TableCell className="text-center">
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(client.charge_amount)}
      </TableCell>
      <TableCell className="text-center">
        {client.birth_date ? format(new Date(client.birth_date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
      </TableCell>
      <TableCell className="text-center">
        <ClientStatus status={client.paymentStatus || 'pending'} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              // Implementar envio de cobrança
              toast({
                title: "Enviando cobrança",
                description: "Funcionalidade em desenvolvimento.",
              });
            }}
            title="Enviar cobrança"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Editar cliente"
          >
            <FileEdit className="h-4 w-4" />
          </Button>

          {client.paymentLink && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyLink();
              }}
              title="Copiar link de pagamento"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Excluir cliente"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}