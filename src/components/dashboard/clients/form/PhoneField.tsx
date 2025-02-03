import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface PhoneFieldProps {
  form: UseFormReturn<Client>;
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
            <div className="flex">
              <div className="w-12 relative border border-r-0 border-input rounded-l-md overflow-hidden">
                <div className="absolute inset-0 bg-[#009c3b]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-4 relative">
                    <div className="absolute inset-[15%] bg-[#ffdf00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                    <div className="absolute inset-[30%] bg-[#002776] rounded-full" />
                  </div>
                </div>
              </div>
              <InputMask
                mask="(99) 99999-9999"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (e.target.value.replace(/\D/g, '').length === 11) {
                    if (!validateWhatsApp(e.target.value)) {
                      form.setError('phone', {
                        type: 'manual',
                        message: 'Número de WhatsApp inválido'
                      });
                    } else {
                      form.clearErrors('phone');
                    }
                  }
                }}
                className="flex-1"
              >
                {(inputProps: any) => (
                  <Input 
                    {...inputProps} 
                    placeholder="Digite o WhatsApp"
                    className="rounded-l-none"
                  />
                )}
              </InputMask>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}