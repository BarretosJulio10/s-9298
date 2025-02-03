import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import InputMask from "react-input-mask";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
}

export function ClientForm({ open, onClose }: ClientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chargeType, setChargeType] = useState("recurring");

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("active", true);

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<Client>({
    defaultValues: {
      name: "",
      email: "",
      document: "",
      phone: "",
      status: "active",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Client) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("clients")
        .insert([{
          ...values,
          company_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente cadastrado com sucesso!",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: "Tente novamente mais tarde",
      });
    },
  });

  function onSubmit(values: Client) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white rounded-lg shadow-lg">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-lg font-medium">Criar um novo cliente</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email do cliente" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputMask
                        mask={field.value.length <= 11 ? "999.999.999-99" : "99.999.999/9999-99"}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(inputProps: any) => (
                          <Input placeholder="CPF ou CNPJ" {...inputProps} />
                        )}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        🇧🇷 +55
                      </span>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-1"
                      >
                        {(inputProps: any) => (
                          <Input 
                            {...inputProps} 
                            placeholder="Digite o WhatsApp"
                            className="rounded-l-none"
                          />
                        )}
                      </InputMask>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tipo de Cobrança</FormLabel>
              <RadioGroup
                value={chargeType}
                onValueChange={setChargeType}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <label htmlFor="recurring" className="cursor-pointer">
                    <div className="font-medium">Recorrente</div>
                    <p className="text-sm text-muted-foreground">
                      Cobranças automáticas mensais
                    </p>
                  </label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                  <RadioGroupItem value="single" id="single" />
                  <label htmlFor="single" className="cursor-pointer">
                    <div className="font-medium">Avulsa</div>
                    <p className="text-sm text-muted-foreground">
                      Cobrança única
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {chargeType === "recurring" && (
              <FormField
                control={form.control}
                name="plan_id"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar pacote" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-1">
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-primary"
                        type="button"
                      >
                        Criar novo plano agora
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Fechar
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                Adicionar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}