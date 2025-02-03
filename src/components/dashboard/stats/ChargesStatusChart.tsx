import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  paid: "#22c55e",
  pending: "#f59e0b",
  overdue: "#ef4444",
  cancelled: "#6b7280"
};

const STATUS_LABELS = {
  paid: "Pagas",
  pending: "Pendentes",
  overdue: "Vencidas",
  cancelled: "Canceladas"
};

export function ChargesStatusChart() {
  const { data: charges } = useQuery({
    queryKey: ["charges-status-chart"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("charges")
        .select("status")
        .eq("company_id", user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const chartData = charges?.reduce((acc: any[], charge) => {
    const statusIndex = acc.findIndex(item => item.status === charge.status);
    if (statusIndex >= 0) {
      acc[statusIndex].value += 1;
    } else {
      acc.push({
        status: charge.status,
        value: 1,
        label: STATUS_LABELS[charge.status as keyof typeof STATUS_LABELS]
      });
    }
    return acc;
  }, []) || [];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Status das Cobranças</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            config={{
              paid: { color: COLORS.paid },
              pending: { color: COLORS.pending },
              overdue: { color: COLORS.overdue },
              cancelled: { color: COLORS.cancelled }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.status as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} cobranças`,
                    "Quantidade"
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}