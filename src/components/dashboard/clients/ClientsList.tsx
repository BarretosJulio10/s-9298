import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClientForm } from "./ClientForm";
import { ClientSearchBar } from "./list/ClientSearchBar";
import { ClientChargesHistory } from "./list/ClientChargesHistory";
import { useClients } from "./list/useClients";
import { supabase } from "@/integrations/supabase/client";
import { ClientListHeader } from "./list/ClientListHeader";
import { ClientsTable } from "./list/ClientsTable";

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
      <ClientListHeader 
        onNewClient={() => setShowForm(true)}
        onSendNotifications={handleSendNotifications}
        sending={sending}
      />

      <ClientSearchBar
        perPage={perPage}
        searchTerm={searchTerm}
        onPerPageChange={setPerPage}
        onSearchChange={setSearchTerm}
      />

      <ClientsTable 
        clients={filteredClients || []}
        onSelectClient={setSelectedClient}
        onSendMessage={() => {}}
        onEdit={() => {}}
      />

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