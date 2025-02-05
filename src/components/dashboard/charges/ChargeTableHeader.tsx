import { TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableCell>Cliente</TableCell>
        <TableCell className="text-center">Valor</TableCell>
        <TableCell className="text-center">Vencimento</TableCell>
        <TableCell className="text-center">Status</TableCell>
        <TableCell className="text-center">Método</TableCell>
        <TableCell className="text-center">Data de Pagamento</TableCell>
        <TableCell className="text-center">Ações</TableCell>
      </TableRow>
    </TableHeader>
  );
}