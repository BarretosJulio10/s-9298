
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody } from "@/components/ui/table";
import { ChargeTableHeader } from "./ChargeTableHeader";
import { ChargeTableRow } from "./ChargeTableRow";

interface ChargesListProps {
  companyId?: string;
}

export function ChargesList({ companyId }: ChargesListProps) {
  const { toast } = useToast();

  const charges = [
    {
      id: "1",
      customer_name: "JULIO CESAR QUINTANILHA BARRETO",
      amount: 5.00,
      due_date: "2024-02-09",
      status: "pending",
      payment_method: "pix",
      payment_date: null
    },
    {
      id: "2",
      customer_name: "Barretos Burguer",
      amount: 5.00,
      due_date: "2024-02-09",
      status: "pending",
      payment_method: "pix",
      payment_date: null
    },
    {
      id: "3",
      customer_name: "Julio Cesar",
      amount: 5.00,
      due_date: "2024-05-06",
      status: "pending",
      payment_method: "pix",
      payment_date: null
    }
  ];

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
