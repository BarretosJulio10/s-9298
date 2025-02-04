import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function WalletStats() {
  const { data: stats } = useQuery({
    queryKey: ["wallet-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: transactions, error } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("company_id", user.id)
        .gte("transaction_date", today.toISOString());

      if (error) throw error;

      const todayIncome = transactions
        ?.filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const todayExpense = transactions
        ?.filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const balance = todayIncome - todayExpense;

      return { todayIncome, todayExpense, balance };
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Entradas Hoje</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats?.todayIncome || 0)}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <ArrowUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Saídas Hoje</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats?.todayExpense || 0)}
            </p>
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <ArrowDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Saldo do Dia</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats?.balance || 0)}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}