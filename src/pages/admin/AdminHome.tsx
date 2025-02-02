import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, CreditCard, CheckCircle, XCircle } from "lucide-react";

const AdminHome = () => {
  const { data: stats = { total: 0, active: 0, pending: 0, inactive: 0 } } = useQuery({
    queryKey: ["companiesStats"],
    queryFn: async () => {
      const { data: companies } = await supabase
        .from("profiles")
        .select("status");

      if (!companies) return { total: 0, active: 0, pending: 0, inactive: 0 };

      return {
        total: companies.length,
        active: companies.filter(c => c.status === 'active').length,
        pending: companies.filter(c => c.status === 'pending').length,
        inactive: companies.filter(c => c.status === 'inactive').length
      };
    },
  });

  const { data: plansCount = 0 } = useQuery({
    queryKey: ["plansCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("plans")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Empresas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas Ativas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empresas Pendentes
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Planos Ativos
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plansCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;