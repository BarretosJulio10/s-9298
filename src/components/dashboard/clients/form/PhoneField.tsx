import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface PhoneFieldProps {
  form: UseFormReturn<Client & { amount?: number }>;
  validateWhatsApp: (phone: string) => boolean;
}

export function PhoneField({ form, validateWhatsApp }: PhoneFieldProps) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input 
              placeholder="WhatsApp"
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                if (!validateWhatsApp(value)) {
                  form.setError("phone", {
                    type: "manual",
                    message: "Número de WhatsApp inválido"
                  });
                } else {
                  form.clearErrors("phone");
                }
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}