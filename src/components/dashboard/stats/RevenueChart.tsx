import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function RevenueChart() {
  const { data: charges } = useQuery({
    queryKey: ["revenue-chart"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("charges")
        .select("amount, payment_date, status")
        .eq("company_id", user.id)
        .gte("payment_date", startOfMonth(new Date()).toISOString())
        .lte("payment_date", endOfMonth(new Date()).toISOString());

      if (error) throw error;
      return data || [];
    },
  });

  const chartData = charges?.reduce((acc: any[], charge) => {
    const date = format(new Date(charge.payment_date), "dd/MM", { locale: ptBR });
    const existingDay = acc.find(item => item.date === date);

    if (existingDay) {
      existingDay.amount += Number(charge.amount);
    } else {
      acc.push({
        date,
        amount: Number(charge.amount)
      });
    }

    return acc;
  }, []) || [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Receitas do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              amount: { color: "#22c55e" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => {
                    if (typeof value === 'number') {
                      return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        notation: 'compact'
                      }).format(value);
                    }
                    return '';
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Valor
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(Number(payload[0].value))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="currentColor"
                  className="fill-primary"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}