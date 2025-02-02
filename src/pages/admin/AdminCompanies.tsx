import { useQuery } from "@tanstack/react-query";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminCompanies = () => {
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
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
            <TableHead>Status</TableHead>
            <TableHead>Data de Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.company_name || "-"}</TableCell>
              <TableCell>{company.cnpj || "-"}</TableCell>
              <TableCell>{company.email}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCompanies;