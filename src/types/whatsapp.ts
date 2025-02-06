
export interface WhatsAppStatus {
  status: 'disconnected' | 'connecting' | 'connected';
  instanceKey?: string;
}

export interface WhatsAppProps {
  status: WhatsAppStatus;
  qrCode: string | null;
  isLoading: boolean;
  onAction: () => void;
}
