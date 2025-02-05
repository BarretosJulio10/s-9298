import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChargeFormFields } from "./form/ChargeFormFields";
import { useChargeForm } from "./form/useChargeForm";

export function ChargeForm() {
  const { form, gateways, isLoading, onSubmit } = useChargeForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Cobrança</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ChargeFormFields form={form} gateways={gateways} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Gerando link..." : "Gerar Link de Pagamento"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}