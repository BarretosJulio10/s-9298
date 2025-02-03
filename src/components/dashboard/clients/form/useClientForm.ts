import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  document: z.string().min(1, "Documento é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  birth_date: z.date().optional(),
  charge_type: z.string(),
  charge_amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  payment_methods: z.array(z.string()).min(1, "Selecione pelo menos um método de pagamento"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface UseClientFormProps {
  onCancel: () => void;
}

export function useClientForm({ onCancel }: UseClientFormProps) {
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      document: "",
      phone: "",
      charge_type: "recurring",
      charge_amount: 0,
      payment_methods: ["pix"],
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const formattedData = {
        ...data,
        company_id: user.id,
        status: "active",
        birth_date: data.birth_date?.toISOString().split('T')[0],
      };

      const { error } = await supabase
        .from("clients")
        .insert(formattedData);

      if (error) throw error;

      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso",
      });

      onCancel();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: error.message,
      });
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}