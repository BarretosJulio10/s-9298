import StatCard from "./StatCard";

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

const StatsList = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <StatCard key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
};

export default StatsList;