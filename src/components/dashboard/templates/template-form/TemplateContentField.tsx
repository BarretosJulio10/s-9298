import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TemplateFormData } from "../hooks/useTemplateForm";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TemplateContentFieldProps {
  form: UseFormReturn<TemplateFormData>;
}

export function TemplateContentField({ form }: TemplateContentFieldProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('template_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('template_images')
        .getPublicUrl(filePath);

      form.setValue('image_url', publicUrl);

      toast({
        title: "Imagem carregada com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer upload da imagem",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Conteúdo da Mensagem</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Digite o conteúdo do template..."
                className="min-h-[150px] resize-y"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Você pode usar variáveis como {"{nome}"}, {"{valor}"}, {"{vencimento}"} no conteúdo.
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem do Template</FormLabel>
            <div className="flex items-center gap-4">
              <FormControl>
                <Input
                  type="text"
                  placeholder="URL da imagem"
                  {...field}
                  className="flex-1"
                  readOnly
                />
              </FormControl>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative"
                  disabled={uploading}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {uploading ? "Carregando..." : "Upload"}
                </Button>
              </div>
            </div>
            {field.value && (
              <div className="mt-2">
                <img
                  src={field.value}
                  alt="Preview"
                  className="max-w-[200px] rounded-md"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}