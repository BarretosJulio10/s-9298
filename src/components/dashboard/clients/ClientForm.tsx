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
import { X, CreditCard, Barcode, QrCode, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type Client = Database["public"]["Tables"]["clients"]["Insert"];

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
}

export function ClientForm({ open, onClose }: ClientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [chargeType, setChargeType] = useState("recurring");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["pix"]);

  const validateWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) return false;
    if (cleanPhone[2] !== '9') return false;
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    return true;
  };

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
      birth_date: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Client) => {
      if (!validateWhatsApp(values.phone)) {
        throw new Error("Número de WhatsApp inválido");
      }

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
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar cliente",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    },
  });

  function onSubmit(values: Client) {
    mutation.mutate(values);
  }

  const handlePaymentMethodToggle = (method: string) => {
    setSelectedPaymentMethods(prev => {
      if (prev.includes(method)) {
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== method);
      }
      return [...prev, method];
    });
  };

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
            <div className="space-y-2">
              <FormLabel>Tipo de Cobrança</FormLabel>
              <RadioGroup
                value={chargeType}
                onValueChange={setChargeType}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <label htmlFor="recurring" className="cursor-pointer flex-1">
                    <div className="font-medium">Recorrente</div>
                    <p className="text-sm text-muted-foreground">
                      Cobranças automáticas mensais
                    </p>
                  </label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                  <RadioGroupItem value="single" id="single" />
                  <label htmlFor="single" className="cursor-pointer flex-1">
                    <div className="font-medium">Avulsa</div>
                    <p className="text-sm text-muted-foreground">
                      Cobrança única
                    </p>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início da Cobrança</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <div className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        <div className="w-6 h-4 relative rounded overflow-hidden">
                          <div className="absolute inset-0 bg-[#009c3b]" />
                          <div className="absolute inset-[15%] bg-[#ffdf00]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                          <div className="absolute inset-[30%] bg-[#002776] rounded-full" />
                        </div>
                      </div>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.replace(/\D/g, '').length === 11) {
                            if (!validateWhatsApp(e.target.value)) {
                              form.setError('phone', {
                                type: 'manual',
                                message: 'Número de WhatsApp inválido'
                              });
                            } else {
                              form.clearErrors('phone');
                            }
                          }
                        }}
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

            <div className="border-t pt-4 mt-6">
              <FormLabel className="mb-2 block">Método de Pagamento</FormLabel>
              <div className="grid grid-cols-3 gap-4">
                <div
                  onClick={() => handlePaymentMethodToggle("pix")}
                  className={cn(
                    "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
                    selectedPaymentMethods.includes("pix") && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <span className="text-sm font-medium">PIX</span>
                  </div>
                  {selectedPaymentMethods.includes("pix") && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </div>
                <div
                  onClick={() => handlePaymentMethodToggle("boleto")}
                  className={cn(
                    "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
                    selectedPaymentMethods.includes("boleto") && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Barcode className="h-4 w-4" />
                    <span className="text-sm font-medium">Boleto</span>
                  </div>
                  {selectedPaymentMethods.includes("boleto") && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </div>
                <div
                  onClick={() => handlePaymentMethodToggle("card")}
                  className={cn(
                    "flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
                    selectedPaymentMethods.includes("card") && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">Cartão</span>
                  </div>
                  {selectedPaymentMethods.includes("card") && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </div>
              </div>
            </div>

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
