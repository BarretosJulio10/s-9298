
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

console.log("Iniciando webhook do WhatsApp...")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const instanceKey = body.instance_key;
    const eventType = body.event_type;
    const timestamp = new Date().toISOString();

    console.log("Webhook recebido:", {
      instanceKey,
      eventType,
      body
    });

    // Buscar a conexão e o company_id
    const { data: connection, error: connectionError } = await supabaseClient
      .from('whatsapp_connections')
      .select('company_id, webhook_secret')
      .eq('instance_key', instanceKey)
      .single();

    if (connectionError || !connection) {
      console.error("Erro ao buscar conexão:", connectionError);
      throw new Error("Conexão não encontrada");
    }

    // Registrar o webhook
    const { error: webhookError } = await supabaseClient
      .from('whatsapp_webhooks')
      .insert({
        company_id: connection.company_id,
        instance_key: instanceKey,
        event_type: eventType,
        payload: body,
      });

    if (webhookError) {
      console.error("Erro ao salvar webhook:", webhookError);
      throw new Error("Erro ao registrar webhook");
    }

    // Registrar no log
    const { error: logError } = await supabaseClient
      .from('whatsapp_logs')
      .insert({
        company_id: connection.company_id,
        instance_key: instanceKey,
        event_type: 'webhook_received',
        status: 'success',
        message: `Webhook recebido: ${eventType}`
      });

    if (logError) {
      console.error("Erro ao salvar log:", logError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
