import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface ChargeTypeFieldProps {
  form: UseFormReturn<Client>;
}

export function ChargeTypeField({ form }: ChargeTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="charge_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Cobrança</FormLabel>
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
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
          </FormControl>
        </FormItem>
      )}
    />
  );
}