import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cliente</TableHead>
        <TableHead className="text-center">Valor</TableHead>
        <TableHead className="text-center">Vencimento</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-center">Método</TableHead>
        <TableHead className="text-center">Data de Pagamento</TableHead>
        <TableHead className="text-center">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}