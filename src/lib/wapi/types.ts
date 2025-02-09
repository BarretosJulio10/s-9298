
export interface WapiInstance {
  id: string;
  name: string;
  etiqueta?: string;
  info_api?: {
    host: string;
    connectionKey: string;
    token: string;
  } | null;
  status: 'disconnected' | 'connected' | 'pending';
  qr_code?: string;
}

export interface WapiInstanceResponse {
  id: string;
  name: string;
  etiqueta?: string;
  host: string | null;
  connection_key: string | null;
  api_token: string | null;
  status: 'disconnected' | 'connected' | 'pending';
  qr_code?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
