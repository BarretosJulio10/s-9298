import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormHeader } from "./form/FormHeader";
import { FormFooter } from "./form/FormFooter";
import { ChargeTypeField } from "./form/ChargeTypeField";
import { DocumentField } from "./form/DocumentField";
import { EmailField } from "./form/EmailField";
import { PhoneField } from "./form/PhoneField";
import { PaymentMethodsField } from "./form/PaymentMethodsField";
import { AmountField } from "./form/AmountField";
import { BirthDateField } from "./form/BirthDateField";
import { TemplateField } from "./form/TemplateField";
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

  const handleClose = () => {
    form.reset(); // Limpa todos os campos do formulário
    setChargeType("recurring"); // Reseta o tipo de cobrança para o valor padrão
    setSelectedPaymentMethods(["pix"]); // Reseta os métodos de pagamento para o valor padrão
    onClose();
  };

  function onSubmit(values: any) {
    const formData = {
      ...values,
      payment_methods: selectedPaymentMethods,
      charge_type: chargeType,
    };
    delete formData.template_id;
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white rounded-lg shadow-lg">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <FormHeader onClose={handleClose} />

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
              <BirthDateField form={form} />
              <TemplateField form={form} />
            </div>

            <PaymentMethodsField
              selectedMethods={selectedPaymentMethods}
              onToggle={handlePaymentMethodToggle}
            />

            <FormFooter onClose={handleClose} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}