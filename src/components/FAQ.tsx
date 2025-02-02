const faqs = [
  {
    question: "Como funciona a cobrança recorrente via Pix?",
    answer: "Nossa plataforma gera automaticamente cobranças Pix para seus clientes nas datas programadas, enviando notificações e gerenciando todo o processo de forma automática.",
    iconBg: "bg-pink-50",
  },
  {
    question: "Quais são as taxas cobradas?",
    answer: "Oferecemos as menores taxas do mercado, começando em 0.99% por transação, sem mensalidade ou custos ocultos.",
    iconBg: "bg-purple-50",
  },
  {
    question: "Como faço para integrar com meu sistema?",
    answer: "Disponibilizamos uma API moderna e SDK's para as principais linguagens. Nossa documentação completa permite integração em poucos minutos.",
    iconBg: "bg-blue-50",
  },
  {
    question: "O sistema é seguro?",
    answer: "Sim, utilizamos infraestrutura certificada e seguimos todas as normas do Banco Central para garantir a segurança das transações.",
    iconBg: "bg-pink-50",
  },
  {
    question: "Quanto tempo leva para receber os pagamentos?",
    answer: "Os pagamentos são processados em tempo real e o saldo fica disponível imediatamente na sua conta.",
    iconBg: "bg-pink-50",
  },
  {
    question: "Preciso ter CNPJ para usar?",
    answer: "Sim, é necessário ter CNPJ ativo para utilizar nossa plataforma de cobranças recorrentes.",
    iconBg: "bg-purple-50",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
            <span className="text-sm">?</span>
          </div>
          <span className="text-sm text-secondary">Dúvidas Frequentes</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
          Tire suas dúvidas
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className={`w-12 h-6 ${faq.iconBg} rounded-full mb-6`} />
              <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
              <p className="text-secondary text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;