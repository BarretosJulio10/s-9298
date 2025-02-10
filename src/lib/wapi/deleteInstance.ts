
import { supabase } from "@/integrations/supabase/client";

export async function deleteInstance(instanceId: string): Promise<boolean> {
  try {
    const { data: instance, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (error) throw error;

    const { error: deleteError } = await supabase
      .rpc('delete_whatsapp_instance', { instance_id: instanceId });

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    console.error('Erro ao deletar instância:', error);
    return false;
  }
}
