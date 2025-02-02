import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroActions = () => {
  return (
    <div className="flex gap-4 justify-center">
      <Button size="lg">
        Começar Agora
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline" size="lg">
        Falar com Especialista
      </Button>
    </div>
  );
};

export default HeroActions;