import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Iniciando processamento do webhook do Mercado Pago')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verifica se é um POST
    if (req.method !== 'POST') {
      throw new Error('Método não permitido')
    }

    const body = await req.json()
    console.log('Payload recebido:', JSON.stringify(body))

    // Verifica se é uma notificação de pagamento
    if (body.action === 'payment.updated' && body.data.id) {
      const paymentId = body.data.id
      console.log('ID do pagamento:', paymentId)

      // Busca as configurações do gateway para obter o access token
      const { data: gatewaySettings, error: settingsError } = await supabaseClient
        .from('payment_gateway_settings')
        .select('api_key, company_id')
        .eq('gateway', 'mercadopago')
        .single()

      if (settingsError) {
        console.error('Erro ao buscar configurações:', settingsError)
        throw settingsError
      }

      if (!gatewaySettings?.api_key) {
        throw new Error('Access token do Mercado Pago não encontrado')
      }

      // Busca os detalhes do pagamento na API do Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${gatewaySettings.api_key}`,
        },
      })

      if (!mpResponse.ok) {
        const errorText = await mpResponse.text()
        console.error('Erro na resposta do Mercado Pago:', errorText)
        throw new Error(`Erro ao buscar pagamento: ${mpResponse.statusText}`)
      }

      const payment = await mpResponse.json()
      console.log('Detalhes do pagamento:', JSON.stringify(payment))

      // Verifica se o pagamento foi aprovado
      if (payment.status === 'approved') {
        console.log('Pagamento aprovado, atualizando cobrança...')

        // Atualiza o status da cobrança
        const { error: updateError } = await supabaseClient
          .from('charges')
          .update({ 
            status: 'paid',
            payment_date: new Date().toISOString()
          })
          .eq('payment_link', payment.external_reference)

        if (updateError) {
          console.error('Erro ao atualizar cobrança:', updateError)
          throw updateError
        }

        // Busca os detalhes da cobrança
        const { data: charge, error: chargeError } = await supabaseClient
          .from('charges')
          .select('*')
          .eq('payment_link', payment.external_reference)
          .single()

        if (chargeError) {
          console.error('Erro ao buscar cobrança:', chargeError)
          throw chargeError
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
          console.error('Erro ao criar transação:', transactionError)
          throw transactionError
        }

        console.log('Processamento concluído com sucesso')
      } else {
        console.log(`Pagamento não aprovado. Status: ${payment.status}`)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Erro no webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.status || 400 
      }
    )
  }
})