import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "./types/Invoice";
import { EditInvoiceAmount } from "./edit/EditInvoiceAmount";
import { EditInvoiceStatus } from "./edit/EditInvoiceStatus";
import { EditInvoiceDate } from "./edit/EditInvoiceDate";
import { EditInvoiceActions } from "./edit/EditInvoiceActions";

interface EditInvoiceFormProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function EditInvoiceForm({ invoice, onClose }: EditInvoiceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(invoice?.amount || 0);
  const [status, setStatus] = useState<"pendente" | "atrasado" | "pago">(invoice?.status || "pendente");
  const [dueDate, setDueDate] = useState(invoice?.due_date || '');

  useEffect(() => {
    if (!invoice) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados da fatura.",
      });
      onClose();
    }
  }, [invoice, toast, onClose]);

  if (!invoice) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          amount,
          status,
          due_date: dueDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', invoice.id);

      if (error) throw error;

      // Invalida o cache para forçar uma nova busca dos dados
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });

      toast({
        title: "Fatura atualizada",
        description: "A fatura foi atualizada com sucesso.",
      });

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar fatura:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a fatura.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EditInvoiceAmount amount={amount} onChange={setAmount} />
      <EditInvoiceStatus status={status} onChange={setStatus} />
      <EditInvoiceDate dueDate={dueDate} onChange={setDueDate} />
      <EditInvoiceActions onClose={onClose} />
    </form>
  );
}