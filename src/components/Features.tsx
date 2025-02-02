import FeaturesHeader from "./features/FeaturesHeader";
import FeaturesList from "./features/FeaturesList";

const Features = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <FeaturesHeader
          title="Tudo que você precisa"
          subtitle="Recursos"
        />
        <FeaturesList />
      </div>
    </section>
  );
};

export default Features;