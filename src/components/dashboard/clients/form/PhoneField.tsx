import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface PhoneFieldProps {
  form: UseFormReturn<Client>;
  validateWhatsApp: (phone: string) => Promise<boolean>;
}

export function PhoneField({ form, validateWhatsApp }: PhoneFieldProps) {
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handlePhoneChange = async (value: string) => {
    if (value.replace(/\D/g, '').length === 11) {
      setIsChecking(true);
      try {
        const isValid = await validateWhatsApp(value);
        setIsValidPhone(isValid);
      } catch (error) {
        setIsValidPhone(false);
      }
      setIsChecking(false);
    } else {
      setIsValidPhone(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <div className="relative">
            <InputMask
              mask="(99) 99999-9999"
              value={field.value || ''}
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                handlePhoneChange(value);
              }}
              maskChar={null}
            >
              {(inputProps: any) => (
                <FormControl>
                  <Input 
                    placeholder="WhatsApp" 
                    {...inputProps} 
                    className="bg-white"
                  />
                </FormControl>
              )}
            </InputMask>
            {field.value && field.value.replace(/\D/g, '').length === 11 && (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isValidPhone ? 'text-green-500' : 'text-red-500'}`}>
                {isChecking ? 'Verificando...' : (isValidPhone ? 'Válido' : 'Inválido')}
              </span>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}