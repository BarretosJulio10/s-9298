import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Painel Administrativo</h1>
          <p className="text-gray-600">Bem-vindo ao painel administrativo do PagouPix.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;