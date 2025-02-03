import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Copy, 
  FileEdit, 
  Ban,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditChargeForm } from "./EditChargeForm";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      case "cancelled":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "paid":
        return "Pago";
      case "pending":
        return "Pendente";
      case "overdue":
        return "Vencido";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "pix":
        return "PIX";
      case "boleto":
        return "Boleto";
      case "credit_card":
        return "Cartão de Crédito";
      default:
        return method;
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges?.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{charge.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{charge.customer_email}</p>
                  </div>
                </TableCell>
                <TableCell>{charge.customer_document}</TableCell>
                <TableCell className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(charge.amount)}
                </TableCell>
                <TableCell>
                  {format(new Date(charge.due_date), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(charge.status)}>
                    {formatStatus(charge.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatPaymentMethod(charge.payment_method)}
                </TableCell>
                <TableCell>
                  {charge.payment_date
                    ? format(new Date(charge.payment_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {charge.payment_link && charge.status !== "cancelled" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyPaymentLink(charge.payment_link!)}
                          title="Copiar link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(charge.payment_link, '_blank')}
                          title="Abrir link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {charge.status !== "cancelled" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Editar"
                          disabled={charge.status === "paid"}
                          onClick={() => setEditingCharge(charge)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              title="Cancelar"
                              disabled={charge.status === "paid"}
                              onClick={() => setSelectedChargeId(charge.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancelar cobrança</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja cancelar esta cobrança? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setSelectedChargeId(null)}>
                                Não, manter cobrança
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => selectedChargeId && cancelCharge.mutate(selectedChargeId)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Sim, cancelar cobrança
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
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
    </>
  );
}