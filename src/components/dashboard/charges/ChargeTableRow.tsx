import { TableCell, TableRow } from "@/components/ui/table";
import { ChargeStatus } from "./charge-row/ChargeStatus";
import { ChargeAmount } from "./charge-row/ChargeAmount";
import { ChargeDate } from "./charge-row/ChargeDate";
import { ChargeActions } from "./charge-row/ChargeActions";

interface ChargeTableRowProps {
  charge: {
    id: string;
    customer_name: string;
    customer_document: string;
    amount: number;
    due_date: string;
    status: string;
    payment_method: string;
    payment_date: string | null;
    payment_link?: string;
    mercadopago_id?: string;
  };
}

export function ChargeTableRow({ charge }: ChargeTableRowProps) {
  return (
    <TableRow>
      <TableCell>{charge.mercadopago_id || "-"}</TableCell>
      <TableCell>{charge.customer_name}</TableCell>
      <TableCell>{charge.customer_document}</TableCell>
      <TableCell>
        <ChargeAmount amount={charge.amount} />
      </TableCell>
      <TableCell>
        <ChargeDate date={charge.due_date} />
      </TableCell>
      <TableCell>
        <ChargeStatus status={charge.status} />
      </TableCell>
      <TableCell className="capitalize">
        {charge.payment_method === "pix" ? "PIX" : charge.payment_method}
      </TableCell>
      <TableCell>
        <ChargeDate date={charge.payment_date} label="-" />
      </TableCell>
      <TableCell className="text-right">
        <ChargeActions
          paymentLink={charge.payment_link}
          status={charge.status}
          chargeId={charge.id}
        />
      </TableCell>
    </TableRow>
  );
}