import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormHeader } from "./form/FormHeader";
import { FormFooter } from "./form/FormFooter";
import { DocumentField } from "./form/DocumentField";
import { EmailField } from "./form/EmailField";
import { PhoneField } from "./form/PhoneField";
import { ChargeTypeField } from "./form/ChargeTypeField";
import { PaymentMethodsField } from "./form/PaymentMethodsField";
import { AmountField } from "./form/AmountField";
import { BirthDateField } from "./form/BirthDateField";
import { useClientForm } from "./form/useClientForm";

interface ClientFormProps {
  onCancel: () => void;
  open: boolean;
}

export function ClientForm({ onCancel, open }: ClientFormProps) {
  const { form, onSubmit, isSubmitting } = useClientForm({ onCancel });

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormHeader onClose={onCancel} />

            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-4">
                  <DocumentField form={form} />
                  <EmailField form={form} />
                  <PhoneField form={form} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <ChargeTypeField form={form} />
                    <AmountField form={form} />
                  </div>
                  <BirthDateField form={form} />
                </div>

                <PaymentMethodsField form={form} />
              </div>
            </div>

            <FormFooter onClose={onCancel} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}