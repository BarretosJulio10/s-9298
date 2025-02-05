
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody } from "@/components/ui/table";
import { ChargeTableHeader } from "./ChargeTableHeader";
import { ChargeTableRow } from "./ChargeTableRow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChargesListProps {
  companyId?: string;
}

export function ChargesList({ companyId }: ChargesListProps) {
  const { toast } = useToast();

  const { data: charges = [], isLoading } = useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("charges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar cobranças:", error);
        throw error;
      }

      return data || [];
    }
  });

  if (isLoading) {
    return <div>Carregando cobranças...</div>;
  }

  const handleDelete = (chargeId: string) => {
    toast({
      description: "Cobrança excluída com sucesso!",
    });
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <ChargeTableHeader />
        <TableBody>
          {charges.map((charge) => (
            <ChargeTableRow 
              key={charge.id} 
              charge={charge} 
              onDelete={() => handleDelete(charge.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
