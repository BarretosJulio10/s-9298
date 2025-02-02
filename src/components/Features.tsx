const features = [
  {
    title: "Integração Fácil",
    description: "Conecte com suas ferramentas e apps favoritos em minutos",
  },
  {
    title: "Análises Poderosas",
    description: "Obtenha insights e visualização de dados para impulsionar o crescimento",
  },
  {
    title: "Colaboração em Equipe",
    description: "Trabalhe em conjunto com toda sua equipe de forma integrada",
  },
  {
    title: "Armazenamento em Nuvem",
    description: "Armazenamento seguro e escalável para todas as suas necessidades",
  },
  {
    title: "Suporte 24/7",
    description: "Ajuda especializada disponível sempre que você precisar",
  },
  {
    title: "Atualizações Regulares",
    description: "Novos recursos e melhorias todos os meses",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que Você Precisa
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Nossa plataforma fornece todas as ferramentas e recursos necessários para seu sucesso no mundo digital
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl hover:bg-opacity-20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 mb-6 rounded-lg bg-highlight/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;