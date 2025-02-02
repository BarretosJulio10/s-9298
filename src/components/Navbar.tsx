import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed w-full z-50 px-6 py-4 bg-white/80 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium text-[#141413]">PagouPix</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#enterprise" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Empresas</a>
          <a href="#pricing" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Preços</a>
          <a href="#docs" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Documentação</a>
          <a href="#faq" className="text-[#141413] hover:text-[#141413]/80 transition-colors">FAQ</a>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
        >
          Sair
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;