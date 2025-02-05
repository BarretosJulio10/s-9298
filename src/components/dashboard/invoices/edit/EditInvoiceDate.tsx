import { Input } from "@/components/ui/input";

interface EditInvoiceDateProps {
  dueDate: string;
  onChange: (value: string) => void;
}

export function EditInvoiceDate({ dueDate, onChange }: EditInvoiceDateProps) {
  return (
    <div>
      <label className="text-sm font-medium">Data de Vencimento</label>
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}