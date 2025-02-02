const features = [
  {
    title: "Easy Integration",
    description: "Connect with your favorite tools and apps in minutes",
  },
  {
    title: "Powerful Analytics",
    description: "Get insights and data visualization to drive growth",
  },
  {
    title: "Team Collaboration",
    description: "Work together seamlessly with your entire team",
  },
  {
    title: "Cloud Storage",
    description: "Secure and scalable storage for all your needs",
  },
  {
    title: "24/7 Support",
    description: "Expert help available whenever you need it",
  },
  {
    title: "Regular Updates",
    description: "New features and improvements every month",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to succeed in today's digital world
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