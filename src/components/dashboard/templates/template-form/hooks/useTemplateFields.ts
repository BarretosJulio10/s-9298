
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TemplateField } from "../types";

export function useTemplateFields() {
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);

  useEffect(() => {
    fetchTemplateFields();
  }, []);

  const fetchTemplateFields = async () => {
    try {
      const { data, error } = await supabase
        .from('template_fields')
        .select('id, name, display_name, category, description')
        .order('category', { ascending: true });

      if (error) throw error;
      setTemplateFields(data);
    } catch (error) {
      console.error('Erro ao carregar campos:', error);
    }
  };

  return { templateFields };
}
