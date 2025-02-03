import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TemplateListHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead>Conteúdo</TableHead>
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}