import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center space-y-8">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
              <span className="text-sm">$</span>
            </div>
            <span className="text-sm text-secondary">Pagamentos Recorrentes</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold max-w-3xl mx-auto leading-tight">
            Automatize suas cobranças com PagouPix
          </h1>
          
          <p className="text-secondary text-xl max-w-2xl mx-auto">
            Receba pagamentos recorrentes via Pix de forma automática, sem burocracia e com as menores taxas do mercado
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;