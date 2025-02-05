import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditInvoiceStatusProps {
  status: "pendente" | "atrasado" | "pago";
  onChange: (value: "pendente" | "atrasado" | "pago") => void;
}

export function EditInvoiceStatus({ status, onChange }: EditInvoiceStatusProps) {
  return (
    <div>
      <label className="text-sm font-medium">Status</label>
      <Select value={status} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="atrasado">Atrasado</SelectItem>
          <SelectItem value="pago">Pago</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}