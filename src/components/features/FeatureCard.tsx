import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="space-y-4">
      <Icon className="w-8 h-8 text-primary" />
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-secondary">{description}</p>
    </div>
  );
};

export default FeatureCard;