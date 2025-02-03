import { FormLabel } from "@/components/ui/form";
import { Check, CreditCard, Barcode, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodsFieldProps {
  selectedMethods: string[];
  onToggle: (method: string) => void;
}

export function PaymentMethodsField({ selectedMethods, onToggle }: PaymentMethodsFieldProps) {
  return (
    <div className="border-t pt-4 mt-6">
      <FormLabel className="mb-2 block">Método de Pagamento</FormLabel>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => onToggle("pix")}
          className={cn(
            "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
            selectedMethods.includes("pix") && "border-primary bg-primary/5"
          )}
        >
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="text-sm font-medium">PIX</span>
          </div>
          {selectedMethods.includes("pix") && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </div>
        <div
          onClick={() => onToggle("boleto")}
          className={cn(
            "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
            selectedMethods.includes("boleto") && "border-primary bg-primary/5"
          )}
        >
          <div className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            <span className="text-sm font-medium">Boleto</span>
          </div>
          {selectedMethods.includes("boleto") && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </div>
        <div
          onClick={() => onToggle("card")}
          className={cn(
            "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
            selectedMethods.includes("card") && "border-primary bg-primary/5"
          )}
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">Cartão</span>
          </div>
          {selectedMethods.includes("card") && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </div>
      </div>
    </div>
  );
}