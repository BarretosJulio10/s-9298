import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export function WalletClosings() {
  const { data: closings } = useQuery({
    queryKey: ["wallet-closings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("wallet_closings")
        .select("*")
        .eq("company_id", user.id)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!closings || closings.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md border">
        <p className="text-muted-foreground">Nenhum fechamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Saldo Inicial</TableHead>
            <TableHead className="text-right">Entradas</TableHead>
            <TableHead className="text-right">Saídas</TableHead>
            <TableHead className="text-right">Saldo Final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {closings.map((closing) => (
            <TableRow key={closing.id}>
              <TableCell>
                {format(new Date(closing.year, closing.month - 1), "MMMM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(closing.opening_balance)}
              </TableCell>
              <TableCell className="text-right text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(closing.total_income)}
              </TableCell>
              <TableCell className="text-right text-red-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(closing.total_expense)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(closing.closing_balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}