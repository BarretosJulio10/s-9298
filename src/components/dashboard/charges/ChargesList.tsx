import { useQuery } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ChargeTableHeader } from "./ChargeTableHeader";
import { ChargeTableRow } from "./ChargeTableRow";
import { Skeleton } from "@/components/ui/skeleton";

export function ChargesList() {
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <ChargeTableHeader />
        <TableBody>
          {charges?.map((charge) => (
            <ChargeTableRow key={charge.id} charge={charge} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}