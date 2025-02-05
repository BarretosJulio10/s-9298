import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ChargeFormData {
  customer_name: string;
  customer_email: string;
  customer_document: string;
  amount: string;
  due_date: string;
  gateway_id: string;
}

interface ChargeFormFieldsProps {
  form: UseFormReturn<ChargeFormData>;
  gateways?: any[];
}

export function ChargeFormFields({ form, gateways }: ChargeFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="customer_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Cliente</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email do Cliente</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer_document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF/CNPJ</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor</FormLabel>
            <FormControl>
              <Input {...field} type="number" step="0.01" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="due_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Vencimento</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gateway_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gateway de Pagamento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gateway" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {gateways?.map((gateway) => (
                  <SelectItem key={gateway.id} value={gateway.id}>
                    {gateway.gateway === "mercadopago"
                      ? "Mercado Pago"
                      : gateway.gateway === "asaas"
                      ? "ASAAS"
                      : gateway.gateway === "paghiper"
                      ? "PagHiper"
                      : gateway.gateway === "picpay"
                      ? "PicPay"
                      : "PagBank"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}