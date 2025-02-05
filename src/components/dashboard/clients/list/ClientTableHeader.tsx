import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ClientTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-left">Código</TableHead>
        <TableHead className="text-left">Nome</TableHead>
        <TableHead className="text-center">Email</TableHead>
        <TableHead className="text-center">Documento</TableHead>
        <TableHead className="text-center">WhatsApp</TableHead>
        <TableHead className="text-center">Valor Cobrança</TableHead>
        <TableHead className="text-center">Status</TableHead>
        <TableHead className="text-left">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}