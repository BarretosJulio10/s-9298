import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Método</TableHead>
        <TableHead>Data Pagamento</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}