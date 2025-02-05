import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { clientId } = await req.json();

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    console.log('Iniciando processo de exclusão do cliente:', clientId);

    // 1. Primeiro, excluir as cobranças pendentes ou atrasadas
    const { error: chargesError } = await supabaseClient
      .from('client_charges')
      .delete()
      .eq('client_id', clientId)
      .in('status', ['pending', 'overdue']);

    if (chargesError) {
      console.error('Erro ao excluir cobranças:', chargesError);
      throw chargesError;
    }

    console.log('Cobranças pendentes e atrasadas excluídas com sucesso');

    // 2. Finalmente, excluir o cliente
    const { error: clientError } = await supabaseClient
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (clientError) {
      console.error('Erro ao excluir cliente:', clientError);
      throw clientError;
    }

    console.log('Cliente excluído com sucesso');

    return new Response(
      JSON.stringify({ message: 'Cliente e cobranças excluídos com sucesso' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro durante o processo de exclusão:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});