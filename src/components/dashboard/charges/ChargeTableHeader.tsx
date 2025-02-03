import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ChargeTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Nome</TableHead>
        <TableHead>WhatsApp</TableHead>
        <TableHead>Data</TableHead>
        <TableHead>Valor Cobrança</TableHead>
        <TableHead>Cobrança rápida</TableHead>
        <TableHead className="text-right">Opções</TableHead>
      </TableRow>
    </TableHeader>
  );
}