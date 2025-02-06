
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

export interface WhatsAppConnection {
  id: string;
  company_id: string;
  name: string;
  instance_key: string | null;
  is_connected: boolean;
  last_qr_code?: string | null;
  last_connection_date?: string | null;
  created_at: string;
  updated_at: string;
}

