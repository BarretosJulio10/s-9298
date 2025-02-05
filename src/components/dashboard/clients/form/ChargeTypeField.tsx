import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormLabel } from "@/components/ui/form";
import { Repeat, CircleDot } from "lucide-react";

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
            <div className="font-medium flex items-center gap-2">
              Recorrente
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Cobranças automáticas mensais
            </p>
          </label>
        </div>
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
          <RadioGroupItem value="single" id="single" />
          <label htmlFor="single" className="cursor-pointer flex-1">
            <div className="font-medium flex items-center gap-2">
              Avulsa
              <CircleDot className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Cobrança única
            </p>
          </label>
        </div>
      </RadioGroup>
    </div>
  );
}