
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useWhatsAppConnection(profileId: string | undefined) {
  return useQuery({
    queryKey: ["whatsapp-connection", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("company_id", profileId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });
}
