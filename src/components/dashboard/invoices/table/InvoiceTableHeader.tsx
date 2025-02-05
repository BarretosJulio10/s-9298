import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InvoiceTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Código</TableHead>
        <TableHead>Cliente</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Documento</TableHead>
        <TableHead>Telefone</TableHead>
        <TableHead className="text-center">Valor</TableHead>
        <TableHead className="text-center">Vencimento</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-center">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}