import HeroTag from "./hero/HeroTag";
import HeroTitle from "./hero/HeroTitle";
import HeroDescription from "./hero/HeroDescription";
import HeroActions from "./hero/HeroActions";

const Hero = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center space-y-8">
          <HeroTag />
          <HeroTitle />
          <HeroDescription />
          <HeroActions />
        </div>
      </div>
    </section>
  );
};

export default Hero;