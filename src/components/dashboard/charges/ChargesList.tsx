import { useQuery } from "@tanstack/react-query";
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

export function ChargesList() {
  const { toast } = useToast();
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
                  {charge.payment_link && (
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
                  <Button
                    variant="outline"
                    size="icon"
                    title="Editar"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  {charge.status !== "paid" && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      title="Cancelar"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}