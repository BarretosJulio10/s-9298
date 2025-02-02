import FAQCard from "./FAQCard";

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

const FAQList = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {faqs.map((faq, index) => (
        <FAQCard
          key={index}
          question={faq.question}
          answer={faq.answer}
          iconBg={faq.iconBg}
        />
      ))}
    </div>
  );
};

export default FAQList;