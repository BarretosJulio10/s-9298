
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export function InvoiceFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: InvoiceFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Buscar por nome, email, CPF ou telefone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="atrasado">Atrasado</SelectItem>
          <SelectItem value="pago">Pago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
