import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface CompanyChargesProps {
  companyId: string;
}

export const CompanyCharges = ({ companyId }: CompanyChargesProps) => {
  const { toast } = useToast();
  
  const { data: charges = [], isLoading } = useQuery({
    queryKey: ["company-charges", companyId],
    queryFn: async () => {
      console.log("Buscando cobranças para company_id:", companyId);
      
      if (!companyId) {
        throw new Error("ID da empresa não fornecido");
      }

      const { data, error } = await supabase
        .from("charges")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar cobranças:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar cobranças",
          description: "Não foi possível carregar as cobranças. Por favor, tente novamente."
        });
        throw error;
      }
      
      console.log("Cobranças encontradas:", data);
      return data || [];
    },
    enabled: !!companyId,
    retry: 1
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

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Data de Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge) => (
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
                  {formatStatus(charge.status)}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">
                {charge.payment_method === "pix" ? "PIX" : charge.payment_method}
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
    </div>
  );
};