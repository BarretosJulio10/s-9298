import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { callWhatsAppAPI } from "@/lib/whatsapp";
import { MessageSquare } from "lucide-react";

const notificationSchema = z.object({
  phone: z.string()
    .min(1, "Telefone é obrigatório")
    .regex(/^[0-9]+$/, "Apenas números são permitidos")
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(11, "Telefone deve ter no máximo 11 dígitos"),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id: string;
    content: string;
  } | null;
}

export function SendNotificationDialog({ open, onOpenChange, template }: SendNotificationDialogProps) {
  const { toast } = useToast();
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      phone: "",
    },
  });

  const sendNotification = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      await callWhatsAppAPI("sendMessage", {
        phone: data.phone,
        message: template?.content,
      });
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada",
        description: "A notificação foi enviada com sucesso",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: NotificationFormData) => {
    if (!template) return;
    sendNotification.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Enviar Notificação
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 11999999999" 
                      {...field} 
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700">Conteúdo da mensagem:</div>
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600 whitespace-pre-wrap">
                {template?.content}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={sendNotification.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={sendNotification.isPending}
              >
                {sendNotification.isPending ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}