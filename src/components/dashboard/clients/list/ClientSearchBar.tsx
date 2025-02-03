import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSearchBarProps {
  perPage: string;
  searchTerm: string;
  onPerPageChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ClientSearchBar({
  perPage,
  searchTerm,
  onPerPageChange,
  onSearchChange,
}: ClientSearchBarProps) {
  return (
    <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Exibir</span>
        <Select value={perPage} onValueChange={onPerPageChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">resultados por página</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Pesquisar</span>
        <Input
          type="search"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-64"
        />
      </div>
    </div>
  );
}