const stats = [
  {
    value: "R$10M+",
    label: "Processados",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "2000+",
    label: "Clientes Ativos",
  },
  {
    value: "<1%",
    label: "Taxa de Falha",
  },
];

const Stats = () => {
  return (
    <section className="py-24 px-6 bg-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;