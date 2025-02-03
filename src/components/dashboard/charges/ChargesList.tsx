import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditChargeForm } from "./EditChargeForm";
import { ChargeTableHeader } from "./ChargeTableHeader";
import { ChargeTableRow } from "./ChargeTableRow";
import { CancelChargeDialog } from "./CancelChargeDialog";

export function ChargesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [editingCharge, setEditingCharge] = useState<any | null>(null);

  const { data: charges, isLoading } = useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("charges")
        .select("*")
        .eq("company_id", user.id)
        .order("due_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const cancelCharge = useMutation({
    mutationFn: async (chargeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: settings, error: settingsError } = await supabase
        .from("company_settings")
        .select("*")
        .eq("company_id", user.id)
        .maybeSingle();

      if (settingsError) throw settingsError;
      if (!settings?.asaas_api_key) {
        throw new Error("Chave API do Asaas não configurada");
      }

      const { data: charge, error: chargeError } = await supabase
        .from("charges")
        .select("asaas_id")
        .eq("id", chargeId)
        .single();

      if (chargeError) throw chargeError;

      const asaasResponse = await fetch("/api/asaas/cancel-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: settings.asaas_api_key,
          environment: settings.asaas_environment,
          chargeId: charge.asaas_id,
        }),
      });

      if (!asaasResponse.ok) {
        const error = await asaasResponse.json();
        throw new Error(error.message || "Erro ao cancelar cobrança no Asaas");
      }

      const { error: updateError } = await supabase
        .from("charges")
        .update({ status: "cancelled" })
        .eq("id", chargeId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      toast({
        title: "Cobrança cancelada",
        description: "A cobrança foi cancelada com sucesso",
      });
      setSelectedChargeId(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar cobrança",
        description: error.message,
      });
    },
  });

  const copyPaymentLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link de pagamento foi copiado para sua área de transferência.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Carregando cobranças...</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <ChargeTableHeader />
          <TableBody>
            {charges?.map((charge) => (
              <ChargeTableRow
                key={charge.id}
                charge={charge}
                onCopyLink={copyPaymentLink}
                onEdit={() => setEditingCharge(charge)}
                onCancel={() => setSelectedChargeId(charge.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editingCharge !== null} onOpenChange={() => setEditingCharge(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cobrança</DialogTitle>
          </DialogHeader>
          {editingCharge && (
            <EditChargeForm
              charge={editingCharge}
              onCancel={() => setEditingCharge(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <CancelChargeDialog
        open={selectedChargeId !== null}
        onOpenChange={(open) => !open && setSelectedChargeId(null)}
        onConfirm={() => selectedChargeId && cancelCharge.mutate(selectedChargeId)}
      />
    </>
  );
}