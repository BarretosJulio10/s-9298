import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead>Documento</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Método</TableHead>
        <TableHead>Pagamento</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}