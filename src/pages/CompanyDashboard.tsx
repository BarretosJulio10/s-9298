import { Sidebar } from "@/components/ui/sidebar";
import { CompanyCharges } from "@/components/dashboard/charges/CompanyCharges";
import { useAuth } from "@/hooks/useAuth";

const CompanyDashboard = () => {
  const { session } = useAuth();

  return (
    <div className="flex h-screen">
      <Sidebar>
        <Sidebar.Group>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem href="/dashboard" icon="home">
                Início
              </Sidebar.MenuItem>
              <Sidebar.MenuItem href="/dashboard/charges" icon="creditCard">
                Cobranças
              </Sidebar.MenuItem>
              <Sidebar.MenuItem href="/dashboard/templates" icon="messageSquare">
                Templates
              </Sidebar.MenuItem>
              <Sidebar.MenuItem href="/dashboard/settings" icon="settings">
                Configurações
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <CompanyCharges companyId={session?.user?.id || ''} />
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;