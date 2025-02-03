import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle, Ban } from "lucide-react";

export function DashboardStats() {
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

      const pendingAmount = charges?.reduce((acc, curr) => 
        curr.status === "pending" ? acc + Number(curr.amount) : acc, 0) || 0;
      const overdueAmount = charges?.reduce((acc, curr) => 
        curr.status === "overdue" ? acc + Number(curr.amount) : acc, 0) || 0;
      const totalAmount = charges?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      const pendingCount = charges?.filter(c => c.status === "pending").length || 0;
      const overdueCount = charges?.filter(c => c.status === "overdue").length || 0;
      const totalCount = charges?.length || 0;

      return {
        pendingAmount,
        overdueAmount,
        totalAmount,
        pendingCount,
        overdueCount,
        totalCount
      };
    }
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">A Receber</h3>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats?.pendingAmount || 0)}
            </p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {stats?.pendingCount || 0} cobranças pendentes
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Vencidas</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats?.overdueAmount || 0)}
            </p>
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {stats?.overdueCount || 0} cobranças vencidas
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Geral</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats?.totalAmount || 0)}
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <Ban className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Total de {stats?.totalCount || 0} cobranças
        </p>
      </Card>
    </div>
  );
}