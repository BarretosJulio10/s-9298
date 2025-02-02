interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-secondary">{label}</div>
    </div>
  );
};

export default StatCard;