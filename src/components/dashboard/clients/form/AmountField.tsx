import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface AmountFieldProps {
  form: UseFormReturn<Client>;
}

export function AmountField({ form }: AmountFieldProps) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const rawValue = event.target.value.replace(/\D/g, '');
    
    // Converte o valor para reais (divide por 100 para considerar os centavos)
    const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
    
    console.log('Valor original:', event.target.value);
    console.log('Valor processado:', rawValue);
    console.log('Valor final:', numericValue);
    
    form.setValue('charge_amount', numericValue);
  };

  const formatAmount = (value: number | undefined) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <FormField
      control={form.control}
      name="charge_amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Valor da Cobrança</FormLabel>
          <FormControl>
            <Input
              placeholder="R$ 0,00"
              onChange={handleAmountChange}
              value={formatAmount(field.value)}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}