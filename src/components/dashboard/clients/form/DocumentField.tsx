import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { DocumentTypeSelector } from "./document/DocumentTypeSelector";
import { DocumentInput } from "./document/DocumentInput";
import { useDocumentValidation } from "./document/useDocumentValidation";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface DocumentFieldProps {
  form: UseFormReturn<Client>;
}

export function DocumentField({ form }: DocumentFieldProps) {
  const [documentType, setDocumentType] = useState<'cpf' | 'cnpj'>('cpf');
  const [isValidDocument, setIsValidDocument] = useState(false);
  const { validateCPF, validateCNPJ, generateValidCPF, generateValidCNPJ } = useDocumentValidation();

  const handleDocumentChange = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    if (documentType === 'cpf' && cleanValue.length === 11) {
      setIsValidDocument(validateCPF(cleanValue));
    } else if (documentType === 'cnpj' && cleanValue.length === 14) {
      setIsValidDocument(validateCNPJ(cleanValue));
    } else {
      setIsValidDocument(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="document"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-2">
            <DocumentTypeSelector
              value={documentType}
              onChange={(value) => {
                setDocumentType(value);
                form.setValue('document', '');
                setIsValidDocument(false);
              }}
            />

            <div className="flex items-center gap-2">
              <DocumentInput
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value);
                  handleDocumentChange(value);
                }}
                mask={documentType === 'cpf' ? "999.999.999-99" : "99.999.999/9999-99"}
                isValid={isValidDocument}
                documentType={documentType}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const generatedValue = documentType === 'cpf' 
                    ? generateValidCPF() 
                    : generateValidCNPJ();
                  form.setValue('document', generatedValue);
                  setIsValidDocument(true);
                }}
                title={`Gerar ${documentType.toUpperCase()} válido`}
                className="flex-shrink-0"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}