import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "./types/Invoice";

interface EditInvoiceFormProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function EditInvoiceForm({ invoice, onClose }: EditInvoiceFormProps) {
  const { toast } = useToast();
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
      <div>
        <label className="text-sm font-medium">Valor</label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={(value: "pendente" | "atrasado" | "pago") => setStatus(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Data de Vencimento</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
}