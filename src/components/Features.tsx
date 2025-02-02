import { CheckCircle2 } from "lucide-react";

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

const Features = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
            <span className="text-sm">✨</span>
          </div>
          <span className="text-sm text-secondary">Recursos</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
          Tudo que você precisa
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <feature.icon className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-medium">{feature.title}</h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;