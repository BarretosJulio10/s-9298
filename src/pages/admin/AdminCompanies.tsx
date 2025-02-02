import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCompanies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, plans(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Sucesso",
        description: "Status da empresa atualizado com sucesso",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar status da empresa",
      });
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empresas</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company: any) => (
            <TableRow key={company.id}>
              <TableCell>{company.company_name || "-"}</TableCell>
              <TableCell>{company.cnpj || "-"}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.plans?.name || "Sem plano"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    company.status === "active"
                      ? "success"
                      : company.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {company.status === "active"
                    ? "Ativo"
                    : company.status === "pending"
                    ? "Pendente"
                    : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(company.created_at), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>
                {company.status !== "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus.mutate({ id: company.id, status: "active" })}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ativar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus.mutate({ id: company.id, status: "inactive" })}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspender
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCompanies;