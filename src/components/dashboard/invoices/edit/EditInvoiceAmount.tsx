import { Input } from "@/components/ui/input";

interface EditInvoiceAmountProps {
  amount: number;
  onChange: (value: number) => void;
}

export function EditInvoiceAmount({ amount, onChange }: EditInvoiceAmountProps) {
  return (
    <div>
      <label className="text-sm font-medium">Valor</label>
      <Input
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => onChange(Number(e.target.value))}
        required
      />
    </div>
  );
}