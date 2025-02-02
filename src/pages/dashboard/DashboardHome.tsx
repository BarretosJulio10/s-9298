import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChargesList } from "@/components/dashboard/charges/ChargesList";
import { ChargeForm } from "@/components/dashboard/charges/ChargeForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

const DashboardHome = () => {
  const [showChargeForm, setShowChargeForm] = useState(false);
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: charges, error } = await supabase
        .from("charges")
        .select("status, amount")
        .eq("company_id", user.id);

      if (error) throw error;

      const total = charges?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      const pending = charges?.filter(c => c.status === "pending").length || 0;
      const paid = charges?.filter(c => c.status === "paid").length || 0;
      const overdue = charges?.filter(c => c.status === "overdue").length || 0;

      return {
        total,
        pending,
        paid,
        overdue
      };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowChargeForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Cobrança
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Cobrado</h3>
          <p className="mt-2 text-3xl font-semibold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(stats?.total || 0)}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {stats?.pending || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pagas</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {stats?.paid || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Vencidas</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">
            {stats?.overdue || 0}
          </p>
        </Card>
      </div>

      {showChargeForm ? (
        <div className="mt-6">
          <ChargeForm />
          <Button 
            variant="outline" 
            onClick={() => setShowChargeForm(false)}
            className="mt-4"
          >
            Voltar para Lista
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          <ChargesList />
        </div>
      )}
    </div>
  );
};

export default DashboardHome;