
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { TemplateField } from "../types";
import { Database } from "@/lib/database.types";

type TemplateFieldRow = Database['public']['Tables']['template_fields']['Row'];

export function useTemplateFields() {
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([]);

  useEffect(() => {
    fetchTemplateFields();
  }, []);

  const fetchTemplateFields = async () => {
    try {
      const { data, error } = await supabase
        .from('template_fields')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      
      // Transformar os dados do banco para o formato esperado pelo componente
      const transformedData: TemplateField[] = (data as TemplateFieldRow[]).map(field => ({
        id: field.id,
        name: field.name,
        display_name: field.display_name,
        category: field.category,
        description: field.description
      }));

      setTemplateFields(transformedData);
    } catch (error) {
      console.error('Erro ao carregar campos:', error);
    }
  };

  return { templateFields };
}
