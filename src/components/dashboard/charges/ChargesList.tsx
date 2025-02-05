
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
  const charges = [
    {
      id: "1",
      customer_name: "João Silva",
      amount: 100.00,
      due_date: "2024-03-20",
      status: "pending",
      payment_method: "pix",
      payment_date: null
    },
    {
      id: "2",
      customer_name: "Maria Santos",
      amount: 150.00,
      due_date: "2024-03-21",
      status: "paid",
      payment_method: "credit_card",
      payment_date: "2024-03-19"
    }
  ];

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
