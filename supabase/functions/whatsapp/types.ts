
export interface WebhookConfig {
  connectionWebhook?: string;
  messageWebhook?: string;
  messageStatusWebhook?: string;
  groupWebhook?: string;
  presenceWebhook?: string;
  labelsWebhook?: string;
}

export interface WhatsAppConnection {
  company_id: string;
  instance_key: string;
  is_connected: boolean;
  last_qr_code?: string;
  last_connection_date?: string;
}

