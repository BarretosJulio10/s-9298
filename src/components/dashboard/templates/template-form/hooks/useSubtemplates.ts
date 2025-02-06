import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subtemplateTypes } from "../../constants/templateTypes";
import { useToast } from "@/hooks/use-toast";

interface SubtemplateState {
  content: string;
  imageFile: File | null;
  imageUrl: string;
}

export function useSubtemplates(templateId?: string) {
  const [subtemplates, setSubtemplates] = useState<SubtemplateState[]>(
    Array(3).fill({
      content: "",
      imageFile: null,
      imageUrl: ""
    })
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubtemplates = async () => {
      if (!templateId) return;

      try {
        const { data, error } = await supabase
          .from('message_templates')
          .select('*')
          .eq('parent_id', templateId);

        if (error) throw error;

        if (data) {
          const updatedSubtemplates = subtemplateTypes.map(type => {
            const subtemplate = data.find(st => st.subtype === type.type);
            return {
              content: subtemplate?.content || "",
              imageFile: null,
              imageUrl: subtemplate?.image_url || ""
            };
          });
          setSubtemplates(updatedSubtemplates);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar subtemplates",
          description: error.message
        });
      }
    };

    fetchSubtemplates();
  }, [templateId, toast]);

  const handleContentChange = (index: number, content: string) => {
    setSubtemplates(prev => prev.map((st, i) => 
      i === index ? { ...st, content } : st
    ));
  };

  const handleImageChange = (index: number, file: File) => {
    setSubtemplates(prev => prev.map((st, i) => 
      i === index ? { ...st, imageFile: file, imageUrl: "" } : st
    ));
  };

  return {
    subtemplates,
    handleContentChange,
    handleImageChange
  };
}