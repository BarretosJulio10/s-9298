import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCharges() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cobranças</h2>
        <p className="text-muted-foreground">
          Visualize todas as cobranças do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cobranças</CardTitle>
        </CardHeader>
        <CardContent>
          <ChargesList />
        </CardContent>
      </Card>
    </div>
  );
}