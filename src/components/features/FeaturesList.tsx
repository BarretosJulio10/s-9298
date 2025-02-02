import { CheckCircle2 } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Integração Simples",
    description: "API moderna e documentação completa para integrar em minutos",
    icon: CheckCircle2,
  },
  {
    title: "Cobrança Automática",
    description: "Gere cobranças recorrentes automaticamente sem intervenção manual",
    icon: CheckCircle2,
  },
  {
    title: "Menores Taxas",
    description: "Economize com as menores taxas do mercado para Pix recorrente",
    icon: CheckCircle2,
  },
  {
    title: "Gestão Completa",
    description: "Dashboard intuitivo para acompanhar pagamentos e clientes",
    icon: CheckCircle2,
  },
  {
    title: "Suporte Especializado",
    description: "Time técnico disponível 24/7 para ajudar sua empresa",
    icon: CheckCircle2,
  },
  {
    title: "Segurança Total",
    description: "Infraestrutura robusta e certificada para suas transações",
    icon: CheckCircle2,
  },
];

const FeaturesList = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeaturesList;