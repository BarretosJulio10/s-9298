import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface PhoneFieldProps {
  form: UseFormReturn<Client>;
  validateWhatsApp: (phone: string) => boolean;
}

interface Country {
  code: string;
  flag: string;
  name: string;
  ddi: string;
}

const countries: Country[] = [
  { code: "BR", flag: "🇧🇷", name: "Brasil", ddi: "55" },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos", ddi: "1" },
  { code: "PT", flag: "🇵🇹", name: "Portugal", ddi: "351" },
  { code: "ES", flag: "🇪🇸", name: "Espanha", ddi: "34" },
  { code: "FR", flag: "🇫🇷", name: "França", ddi: "33" },
  { code: "IT", flag: "🇮🇹", name: "Itália", ddi: "39" },
  { code: "DE", flag: "🇩🇪", name: "Alemanha", ddi: "49" },
  { code: "UK", flag: "🇬🇧", name: "Reino Unido", ddi: "44" },
];

export function PhoneField({ form, validateWhatsApp }: PhoneFieldProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode) || countries[0];
    setSelectedCountry(country);
  };

  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex">
              <Select
                value={selectedCountry.code}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className="w-[100px] border-[0.5px] border-r-0 rounded-r-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="text-sm text-muted-foreground">
                        +{selectedCountry.ddi}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="ml-2">{country.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        +{country.ddi}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputMask
                mask={selectedCountry.code === "BR" ? "(99) 99999-9999" : "999999999999"}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  if (selectedCountry.code === "BR" && e.target.value.replace(/\D/g, '').length === 11) {
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
                    placeholder="Digite o número"
                    className="rounded-l-none border-[0.5px] focus:ring-0 focus:ring-offset-0"
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