
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  createInstance, 
  getInstanceStatus, 
  getQRCode, 
  disconnectInstance, 
  WapiInstance, 
  WapiInstanceResponse 
} from '@/lib/wapi';
import { useToast } from '@/hooks/use-toast';

export function useWapiInstances() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: instances, isLoading } = useQuery({
    queryKey: ['wapi-instances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Converter a resposta para o tipo WapiInstance
      return (data as WapiInstanceResponse[]).map(instance => ({
        id: instance.id,
        name: instance.name,
        etiqueta: instance.etiqueta,
        info_api: instance.info_api as WapiInstance['info_api'],
        status: instance.status,
        qr_code: instance.qr_code
      }));
    }
  });

  const createInstanceMutation = useMutation({
    mutationFn: async (name: string) => {
      return await createInstance(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wapi-instances'] });
      toast({
        title: "Sucesso",
        description: "Instância criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar instância: " + error.message,
      });
    }
  });

  const disconnectInstanceMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      return await disconnectInstance(instanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wapi-instances'] });
      toast({
        title: "Sucesso",
        description: "Instância desconectada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao desconectar instância: " + error.message,
      });
    }
  });

  const refreshStatusMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      return await getInstanceStatus(instanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wapi-instances'] });
    }
  });

  const getQRCodeMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      const qrCode = await getQRCode(instanceId);
      return qrCode;
    }
  });

  return {
    instances,
    isLoading,
    createInstance: createInstanceMutation.mutate,
    disconnectInstance: disconnectInstanceMutation.mutate,
    refreshStatus: refreshStatusMutation.mutate,
    getQRCode: getQRCodeMutation.mutateAsync,
    isCreating: createInstanceMutation.isPending,
    isDisconnecting: disconnectInstanceMutation.isPending,
    isRefreshing: refreshStatusMutation.isPending,
    isGettingQR: getQRCodeMutation.isPending
  };
}
