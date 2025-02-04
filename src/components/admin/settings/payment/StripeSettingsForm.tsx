import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function StripeSettingsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: config } = useQuery({
    queryKey: ["configurations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configurations")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: {
      stripe_product_id?: string;
      stripe_price_id?: string;
    }) => {
      if (config?.id) {
        const { error } = await supabase
          .from("configurations")
          .update(values)
          .eq('id', config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("configurations")
          .insert([values]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configurations"] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    mutation.mutate({
      stripe_product_id: formData.get('stripe_product_id') as string,
      stripe_price_id: formData.get('stripe_price_id') as string,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Stripe</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Os valores das cobranças devem ser configurados diretamente no painel do Stripe.
            Após configurar, copie os IDs do produto e do preço para os campos abaixo.
            <a 
              href="https://dashboard.stripe.com/products" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline mt-2"
            >
              Acessar Painel do Stripe <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="stripe_product_id">ID do Produto</label>
            <Input
              id="stripe_product_id"
              name="stripe_product_id"
              placeholder="prod_..."
              defaultValue={config?.stripe_product_id || ""}
            />
            <p className="text-sm text-muted-foreground">
              ID do produto no Stripe (começa com "prod_"). Você pode encontrar este ID na página do produto no painel do Stripe.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="stripe_price_id">ID do Preço</label>
            <Input
              id="stripe_price_id"
              name="stripe_price_id"
              placeholder="price_..."
              defaultValue={config?.stripe_price_id || ""}
            />
            <p className="text-sm text-muted-foreground">
              ID do preço no Stripe (começa com "price_"). Este ID está vinculado ao valor da mensalidade configurado no Stripe.
            </p>
          </div>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar configurações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}