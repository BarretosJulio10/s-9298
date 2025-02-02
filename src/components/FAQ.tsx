import FAQHeader from "./faq/FAQHeader";
import FAQList from "./faq/FAQList";

const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <FAQHeader
          title="Tire suas dúvidas"
          subtitle="Dúvidas Frequentes"
        />
        <FAQList />
      </div>
    </section>
  );
};

export default FAQ;