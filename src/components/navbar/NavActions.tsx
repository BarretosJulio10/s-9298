import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NavActions = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
    >
      Sair
    </Button>
  );
};

export default NavActions;