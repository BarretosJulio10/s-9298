import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FormHeader } from "./form/FormHeader";
import { FormFooter } from "./form/FormFooter";
import { ChargeTypeField } from "./form/ChargeTypeField";
import { DocumentField } from "./form/DocumentField";
import { EmailField } from "./form/EmailField";
import { PhoneField } from "./form/PhoneField";
import { PaymentMethodsField } from "./form/PaymentMethodsField";
import { AmountField } from "./form/AmountField";
import { useClientForm } from "./form/useClientForm";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
}

export function ClientForm({ open, onClose }: ClientFormProps) {
  const [chargeType, setChargeType] = useState("recurring");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["pix"]);
  const { form, mutation, validateWhatsApp } = useClientForm(onClose);

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
    const formData = {
      ...values,
      payment_methods: selectedPaymentMethods,
      charge_type: chargeType,
    };
    mutation.mutate(formData);
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

            <Input placeholder="Nome do cliente" {...form.register("name")} />

            <div className="grid grid-cols-1 gap-4">
              <EmailField form={form} />
              <PhoneField form={form} validateWhatsApp={validateWhatsApp} />
              <div className="grid grid-cols-2 gap-4">
                <DocumentField form={form} />
                <div className="flex justify-end">
                  <AmountField form={form} />
                </div>
              </div>
            </div>

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