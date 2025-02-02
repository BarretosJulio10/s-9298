interface FAQHeaderProps {
  title: string;
  subtitle: string;
}

const FAQHeader = ({ title, subtitle }: FAQHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-2 justify-center mb-4">
        <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
          <span className="text-sm">?</span>
        </div>
        <span className="text-sm text-secondary">{subtitle}</span>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
        {title}
      </h2>
    </>
  );
};

export default FAQHeader;