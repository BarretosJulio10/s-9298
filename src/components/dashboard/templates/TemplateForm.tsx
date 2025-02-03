import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./template-form/ImageUpload";
import { useTemplateForm } from "./hooks/useTemplateForm";

interface TemplateFormProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

const templateTypes = {
  payment_reminder: {
    label: "Lembrete de Pagamento",
    defaultContent: `Olá {nome}!

Passando para lembrar que você tem uma fatura no valor de {valor} com vencimento em {vencimento}.

Para sua comodidade, você pode pagar através do link: {link_pagamento}

Agradecemos a preferência!`
  },
  due_today: {
    label: "Vencendo Hoje",
    defaultContent: `Olá {nome}!

Sua fatura no valor de {valor} vence hoje!

Para evitar juros e multas, efetue o pagamento através do link: {link_pagamento}

Agradecemos a preferência!`
  },
  payment_confirmation: {
    label: "Confirmação de Pagamento",
    defaultContent: `Olá {nome}!

Recebemos seu pagamento no valor de {valor}. 

Agradecemos a confiança!`
  },
  payment_overdue: {
    label: "Pagamento Atrasado",
    defaultContent: `Olá {nome}!

Identificamos que sua fatura no valor de {valor} está vencida desde {vencimento}.

Para regularizar sua situação e evitar mais encargos, efetue o pagamento através do link: {link_pagamento}

Em caso de dúvidas, estamos à disposição.`
  }
};

export function TemplateForm({ onBack, showBackButton }: TemplateFormProps) {
  const { toast } = useToast();
  const { form, onSubmit, isSubmitting } = useTemplateForm();
  const [selectedType, setSelectedType] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    form.setValue("type", type);
    form.setValue("content", templateTypes[type as keyof typeof templateTypes].defaultContent);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('template_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('template_images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      form.setValue("image_url", publicUrl);

      toast({
        title: "Imagem enviada",
        description: "A imagem foi enviada com sucesso",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar imagem",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Novo Template</h2>
        {showBackButton && onBack && (
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Template</label>
              <Input
                placeholder="Ex: Lembrete Padrão"
                {...form.register("name")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Mensagem</label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de mensagem" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templateTypes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Imagem do Template</label>
              <ImageUpload
                onUpload={handleImageUpload}
                imageUrl={imageUrl}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Conteúdo da Mensagem</label>
              <div className="text-xs text-muted-foreground mb-2">
                Variáveis disponíveis: {"{nome}"}, {"{valor}"}, {"{vencimento}"}, {"{link_pagamento}"}
              </div>
              <Textarea
                rows={8}
                placeholder="Digite o conteúdo da mensagem..."
                {...form.register("content")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Template"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}