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
import { supabase } from "@/integrations/supabase/client";

export function ChargesList() {
  const { data: charges, isLoading } = useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charges")
        .select("*")
        .order("due_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Carregando cobranças...</div>;
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Data Pagamento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {charges?.map((charge) => (
          <TableRow key={charge.id}>
            <TableCell>{charge.customer_name}</TableCell>
            <TableCell>
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
                {charge.status === "paid"
                  ? "Pago"
                  : charge.status === "pending"
                  ? "Pendente"
                  : charge.status === "overdue"
                  ? "Atrasado"
                  : "Cancelado"}
              </Badge>
            </TableCell>
            <TableCell className="capitalize">
              {charge.payment_method === "pix"
                ? "PIX"
                : charge.payment_method === "boleto"
                ? "Boleto"
                : "Cartão"}
            </TableCell>
            <TableCell>
              {charge.payment_date
                ? format(new Date(charge.payment_date), "dd/MM/yyyy", {
                    locale: ptBR,
                  })
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}