interface FAQCardProps {
  question: string;
  answer: string;
  iconBg: string;
}

const FAQCard = ({ question, answer, iconBg }: FAQCardProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className={`w-12 h-6 ${iconBg} rounded-full mb-6`} />
      <h3 className="text-xl font-medium mb-3">{question}</h3>
      <p className="text-secondary text-sm">{answer}</p>
    </div>
  );
};

export default FAQCard;