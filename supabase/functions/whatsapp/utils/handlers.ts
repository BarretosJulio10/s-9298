
import { supabaseClient } from "../db.ts";
import { corsHeaders } from "../../_shared/cors.ts";

export type WhatsAppLogEvent = 'create_instance' | 'check_status' | 'generate_qrcode' | 'disconnect' | 'send_message';

export async function logWhatsAppEvent(params: {
  companyId: string;
  instanceKey: string;
  eventType: WhatsAppLogEvent;
  status: string;
  message: string;
}) {
  const { error } = await supabaseClient
    .from('whatsapp_logs')
    .insert({
      company_id: params.companyId,
      instance_key: params.instanceKey,
      event_type: params.eventType,
      status: params.status,
      message: params.message
    });

  if (error) {
    console.error("Erro ao salvar log:", error);
  }
}

export function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function createErrorResponse(error: Error, status = 500) {
  console.error("Erro na operação:", error);
  return new Response(
    JSON.stringify({ success: false, message: error.message }),
    { status, headers: corsHeaders }
  );
}

export async function getCompanyIdFromInstanceKey(instanceKey: string) {
  const { data: connection, error } = await supabaseClient
    .from('whatsapp_connections')
    .select('company_id')
    .eq('instance_key', instanceKey)
    .single();

  if (error || !connection) {
    throw new Error("Conexão não encontrada");
  }

  return connection.company_id;
}

