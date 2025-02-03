import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Clock, AlertTriangle, Ban } from "lucide-react";

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      console.log("ID da empresa logada:", user.id);

      const { data: charges, error } = await supabase
        .from("charges")
        .select("status, amount, payment_date, due_date")
        .eq("company_id", user.id);

      if (error) {
        console.error("Erro ao buscar cobranças:", error);
        throw error;
      }

      console.log("Cobranças encontradas:", charges);

      const total = charges?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      const pending = charges?.filter(c => c.status === "pending").length || 0;
      const paid = charges?.filter(c => c.status === "paid").length || 0;
      const overdue = charges?.filter(c => c.status === "overdue").length || 0;
      
      const paidAmount = charges?.reduce((acc, curr) => 
        curr.status === "paid" ? acc + Number(curr.amount) : acc, 0) || 0;
      const pendingAmount = charges?.reduce((acc, curr) => 
        curr.status === "pending" ? acc + Number(curr.amount) : acc, 0) || 0;
      const overdueAmount = charges?.reduce((acc, curr) => 
        curr.status === "overdue" ? acc + Number(curr.amount) : acc, 0) || 0;

      const totalCount = paid + pending + overdue;
      const paidPercentage = totalCount > 0 ? Math.round((paid / totalCount) * 100) : 0;
      const pendingPercentage = totalCount > 0 ? Math.round((pending / totalCount) * 100) : 0;
      const overduePercentage = totalCount > 0 ? Math.round((overdue / totalCount) * 100) : 0;

      return {
        total,
        pending,
        paid,
        overdue,
        paidAmount,
        pendingAmount,
        overdueAmount,
        paidPercentage,
        pendingPercentage,
        overduePercentage
      };
    }
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Recebido</h3>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats?.paidAmount || 0)}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <ArrowUpRight className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {stats?.paid || 0} cobranças pagas ({stats?.paidPercentage || 0}%)
        </p>
      </Card>

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
          {stats?.pending || 0} cobranças pendentes ({stats?.pendingPercentage || 0}%)
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
          {stats?.overdue || 0} cobranças vencidas ({stats?.overduePercentage || 0}%)
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Geral</h3>
            <p className="mt-2 text-3xl font-semibold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats?.total || 0)}
            </p>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Ban className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Total de {(stats?.paid || 0) + (stats?.pending || 0) + (stats?.overdue || 0)} cobranças
        </p>
      </Card>
    </div>
  );
}