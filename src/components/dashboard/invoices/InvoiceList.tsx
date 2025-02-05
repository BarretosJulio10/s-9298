import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceFilters } from "./filters/InvoiceFilters";
import { InvoiceTableHeader } from "./table/InvoiceTableHeader";
import { InvoiceTableRow } from "./table/InvoiceTableRow";
import { EditInvoiceDialog } from "./EditInvoiceDialog";
import { DeleteInvoiceDialog } from "./DeleteInvoiceDialog";
import { Invoice } from "./types/Invoice";
import { useInvoices } from "./hooks/useInvoices";

export function InvoiceList() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: invoices, isLoading, error } = useInvoices();

  const handleDelete = async () => {
    if (!deletingInvoice) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', deletingInvoice.id);

      if (error) throw error;

      toast({
        title: "Fatura excluída",
        description: "A fatura foi excluída com sucesso.",
      });

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setDeletingInvoice(null);
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a fatura.",
      });
    }
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    toast({
      title: "Enviar fatura",
      description: "Funcionalidade a ser implementada.",
    });
  };

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const searchFields = [
      invoice.client?.name,
      invoice.client?.email,
      invoice.client?.document,
      invoice.client?.phone,
    ].map(field => field?.toLowerCase() || "");

    const matchesSearch = searchTerm === "" || searchFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );

    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div>Carregando faturas...</div>;
  }

  return (
    <div className="space-y-4">
      <InvoiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <div className="rounded-md border">
        <Table>
          <InvoiceTableHeader />
          <TableBody>
            {filteredInvoices?.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                onEdit={() => setEditingInvoice(invoice)}
                onDelete={() => setDeletingInvoice(invoice)}
                onSend={handleSendInvoice}
              />
            ))}
            {(!filteredInvoices || filteredInvoices.length === 0) && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Nenhuma fatura encontrada
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <EditInvoiceDialog
        invoice={editingInvoice}
        open={!!editingInvoice}
        onOpenChange={(open) => !open && setEditingInvoice(null)}
      />

      <DeleteInvoiceDialog
        open={!!deletingInvoice}
        onOpenChange={(open) => !open && setDeletingInvoice(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}