import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Cliente</TableHead>
        <TableHead>Documento</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Método</TableHead>
        <TableHead>Data Pagamento</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}