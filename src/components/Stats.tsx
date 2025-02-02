const stats = [
  { number: "10k+", label: "Usuários Ativos" },
  { number: "99.9%", label: "Disponibilidade" },
  { number: "24/7", label: "Suporte" },
  { number: "50+", label: "Integrações" },
];

const Stats = () => {
  return (
    <section className="py-24 px-6 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Confiado por Milhares
          </h2>
          <p className="text-accent max-w-2xl mx-auto">
            Junte-se a milhares de clientes satisfeitos que confiam em nossa plataforma
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
              <div className="text-accent">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;