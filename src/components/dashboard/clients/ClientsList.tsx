import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientForm } from "./ClientForm";
import { ClientSearchBar } from "./list/ClientSearchBar";
import { ClientStatus } from "./list/ClientStatus";
import { ClientActions } from "./list/ClientActions";
import { ClientChargesHistory } from "./list/ClientChargesHistory";
import { useClients } from "./list/useClients";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export function ClientsList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const { data: clientsWithCharges, isLoading } = useClients();

  const filteredClients = clientsWithCharges?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendNotifications = async () => {
    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const today = new Date().toISOString().split('T')[0];
      
      const { data: charges, error } = await supabase
        .from('client_charges')
        .select(`
          *,
          clients (
            phone
          )
        `)
        .or(`due_date.eq.${today},status.eq.overdue`)
        .eq('status', 'pending');

      if (error) throw error;

      if (!charges || charges.length === 0) {
        toast({
          title: "Nenhuma cobrança encontrada",
          description: "Não há cobranças vencendo hoje ou em atraso",
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const charge of charges) {
        if (!charge.clients?.phone) continue;

        try {
          const message = `Olá! Você tem uma cobrança ${
            charge.due_date === today ? 'vencendo hoje' : 'em atraso'
          } no valor de R$ ${charge.amount.toFixed(2).replace('.', ',')}. 
          Link para pagamento: ${charge.payment_link}`;

          await callWhatsAppAPI("sendMessage", {
            phone: charge.clients.phone,
            message: message,
          });
          successCount++;
        } catch (err) {
          console.error("Erro ao enviar mensagem:", err);
          errorCount++;
        }
      }

      toast({
        title: "Notificações enviadas",
        description: `${successCount} mensagens enviadas com sucesso. ${errorCount} falhas.`,
      });
    } catch (error) {
      console.error("Erro ao processar notificações:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificações",
        description: "Não foi possível processar as notificações",
      });
    } finally {
      setSending(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>

        <Button
          onClick={handleSendNotifications}
          disabled={sending}
          variant="secondary"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Enviando..." : "Enviar Notificações"}
        </Button>
      </div>

      <ClientSearchBar
        perPage={perPage}
        searchTerm={searchTerm}
        onPerPageChange={setPerPage}
        onSearchChange={setSearchTerm}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[180px]">Nome</TableHead>
              <TableHead className="text-center">WhatsApp</TableHead>
              <TableHead className="text-center">Data</TableHead>
              <TableHead className="text-center">Valor Cobrança</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id.slice(0, 4)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setSelectedClient({ id: client.id, name: client.name })}
                    className="text-left hover:text-primary transition-colors"
                  >
                    {client.name}
                  </button>
                </TableCell>
                <TableCell className="text-center">{client.phone}</TableCell>
                <TableCell className="text-center">
                  {new Date(client.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-center">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(client.charge_amount)}
                </TableCell>
                <TableCell className="text-center">
                  <ClientStatus status={client.paymentStatus} />
                </TableCell>
                <TableCell>
                  <ClientActions
                    onSend={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    paymentLink={client.client_charges?.[0]?.payment_link}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-4 border-t">
          <p className="text-sm text-gray-500">
            Mostrando {filteredClients?.length || 0} de {clientsWithCharges?.length || 0} registros
          </p>
        </div>
      </div>

      <ClientForm 
        open={showForm}
        onClose={() => setShowForm(false)}
      />

      <ClientChargesHistory
        clientId={selectedClient?.id || null}
        clientName={selectedClient?.name || ""}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
}