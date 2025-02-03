import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormLabel } from "@/components/ui/form";

interface ChargeTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChargeTypeField({ value, onChange }: ChargeTypeFieldProps) {
  return (
    <div>
      <FormLabel>Tipo de Cobrança</FormLabel>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
          <RadioGroupItem value="recurring" id="recurring" />
          <label htmlFor="recurring" className="cursor-pointer flex-1">
            <div className="font-medium">Recorrente</div>
            <p className="text-sm text-muted-foreground">
              Cobranças automáticas mensais
            </p>
          </label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
          <RadioGroupItem value="single" id="single" />
          <label htmlFor="single" className="cursor-pointer flex-1">
            <div className="font-medium">Avulsa</div>
            <p className="text-sm text-muted-foreground">
              Cobrança única
            </p>
          </label>
        </div>
      </RadioGroup>
    </div>
  );
}