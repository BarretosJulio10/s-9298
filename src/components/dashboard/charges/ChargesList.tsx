import { useQuery } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ChargeTableHeader } from "./ChargeTableHeader";
import { ChargeTableRow } from "./ChargeTableRow";
import { Skeleton } from "@/components/ui/skeleton";

interface ChargesListProps {
  companyId?: string;
}

export function ChargesList({ companyId }: ChargesListProps) {
  const { data: charges, isLoading } = useQuery({
    queryKey: ["charges", companyId],
    queryFn: async () => {
      let query = supabase
        .from("charges")
        .select("*")
        .order("due_date", { ascending: false });

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar cobranças:", error);
        throw error;
      }
      
      // Adiciona log para debug
      console.log("Charges data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!charges || charges.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md border">
        <p className="text-muted-foreground">Nenhuma cobrança encontrada</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <ChargeTableHeader />
        <TableBody>
          {charges.map((charge) => (
            <ChargeTableRow key={charge.id} charge={charge} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}