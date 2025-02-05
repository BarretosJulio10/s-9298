
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InvoiceTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Documento</TableHead>
        <TableHead>Telefone</TableHead>
        <TableHead className="text-right">Valor</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
