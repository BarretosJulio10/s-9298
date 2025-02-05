import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { payment_id, company_id } = await req.json()

    if (!payment_id || !company_id) {
      throw new Error('payment_id e company_id são obrigatórios')
    }

    console.log('Verificando pagamento:', payment_id, 'da empresa:', company_id)

    // Busca as credenciais do Mercado Pago da empresa
    const { data: settings, error: settingsError } = await supabaseClient
      .from('payment_gateway_settings')
      .select('api_key')
      .eq('company_id', company_id)
      .eq('gateway', 'mercadopago')
      .maybeSingle()

    if (settingsError || !settings?.api_key) {
      throw new Error('Credenciais do Mercado Pago não encontradas')
    }

    // Consulta o status do pagamento na API do Mercado Pago
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
      },
    })

    if (!mpResponse.ok) {
      throw new Error(`Erro ao consultar pagamento: ${mpResponse.statusText}`)
    }

    const payment = await mpResponse.json()
    console.log('Status do pagamento:', payment.status)

    // Se o pagamento estiver aprovado, atualiza a cobrança
    if (payment.status === 'approved') {
      // Busca a cobrança pelo payment_link
      const { data: charge, error: chargeError } = await supabaseClient
        .from('charges')
        .select('*')
        .eq('payment_link', payment.external_reference)
        .maybeSingle()

      if (chargeError || !charge) {
        throw new Error('Cobrança não encontrada')
      }

      // Atualiza o status da cobrança
      const { error: updateError } = await supabaseClient
        .from('charges')
        .update({ 
          status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', charge.id)

      if (updateError) {
        throw new Error('Erro ao atualizar cobrança')
      }

      // Registra a transação na carteira
      const { error: transactionError } = await supabaseClient
        .from('wallet_transactions')
        .insert({
          company_id: charge.company_id,
          type: 'income',
          amount: charge.amount,
          description: `Pagamento da cobrança ${charge.id}`,
          payment_method: 'pix',
          charge_id: charge.id,
          transaction_date: new Date().toISOString()
        })

      if (transactionError) {
        throw new Error('Erro ao registrar transação')
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: payment.status,
          message: 'Pagamento confirmado e cobrança atualizada'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: payment.status,
        message: 'Status do pagamento verificado'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})