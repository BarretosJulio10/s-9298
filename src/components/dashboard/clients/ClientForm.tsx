import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormHeader } from "./form/FormHeader";
import { FormFooter } from "./form/FormFooter";
import { ChargeTypeField } from "./form/ChargeTypeField";
import { BirthDateField } from "./form/BirthDateField";
import { DocumentField } from "./form/DocumentField";
import { EmailField } from "./form/EmailField";
import { PhoneField } from "./form/PhoneField";
import { AmountField } from "./form/AmountField";
import { PaymentMethodsField } from "./form/PaymentMethodsField";
import { useClientForm } from "./form/useClientForm";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
}

export function ClientForm({ open, onClose }: ClientFormProps) {
  const [chargeType, setChargeType] = useState("recurring");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["pix"]);
  const { form, mutation } = useClientForm(onClose);

  const handlePaymentMethodToggle = (method: string) => {
    setSelectedPaymentMethods(prev => {
      if (prev.includes(method)) {
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== method);
      }
      return [...prev, method];
    });
  };

  function onSubmit(values: any) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white rounded-lg shadow-lg">
        <FormHeader onClose={onClose} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
            <ChargeTypeField 
              value={chargeType}
              onChange={setChargeType}
            />

            <BirthDateField form={form} />

            <Input placeholder="Nome do cliente" {...form.register("name")} />

            <div className="grid grid-cols-2 gap-4">
              <EmailField form={form} />
              <DocumentField form={form} />
            </div>

            <PhoneField form={form} />

            {chargeType === "recurring" && (
              <AmountField form={form} />
            )}

            <PaymentMethodsField
              selectedMethods={selectedPaymentMethods}
              onToggle={handlePaymentMethodToggle}
            />

            <FormFooter onClose={onClose} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}