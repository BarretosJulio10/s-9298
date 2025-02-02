const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[#F8FAFF]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, #E2E8F3 2px, transparent 2px)`,
          backgroundSize: '48px 48px',
          opacity: 0.5
        }}></div>
      </div>

      {/* Floating circles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-white border-2 border-gray-200 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-white border-2 border-gray-200 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-white border-2 border-gray-200 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-[80px] leading-[1] font-medium tracking-[-0.02em] text-[#141413] mb-8">
          Sua Solução SaaS<br />Completa
        </h1>
        
        <div className="max-w-[600px] mx-auto mb-12">
          <p className="text-xl text-[#141413]/80">
            Comece seu negócio com nossa plataforma poderosa.
            <br />
            Tudo que você precisa em um só lugar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="inline-flex items-center justify-center gap-2 bg-[#F2FF44] text-[#141413] px-6 py-3 rounded-lg font-medium hover:bg-[#E6FF00] transition-colors">
            Comece Gratuitamente
          </button>
          <button className="inline-flex items-center justify-center gap-2 border-2 border-[#141413] text-[#141413] px-6 py-3 rounded-lg font-medium hover:bg-[#141413] hover:text-white transition-colors">
            Agende uma Demo
          </button>
        </div>

        <div className="max-w-[800px] mx-auto">
          <div className="relative aspect-video rounded-xl shadow-xl overflow-hidden bg-white p-4">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mt-8 w-full h-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;