import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Webhook received:', body)

    // Verifica se é uma notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id
      
      // Busca os detalhes do pagamento na API do Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}`,
        },
      })

      const payment = await mpResponse.json()
      console.log('Payment details:', payment)

      if (payment.status === 'approved') {
        // Atualiza o status da cobrança no banco
        const { error: updateError } = await supabaseClient
          .from('charges')
          .update({ 
            status: 'paid',
            payment_date: new Date().toISOString()
          })
          .eq('payment_link', payment.transaction_details.external_reference)

        if (updateError) {
          console.error('Error updating charge:', updateError)
          throw updateError
        }

        // Registra a transação na carteira
        const { data: charge } = await supabaseClient
          .from('charges')
          .select('*')
          .eq('payment_link', payment.transaction_details.external_reference)
          .single()

        if (charge) {
          const { error: transactionError } = await supabaseClient
            .from('wallet_transactions')
            .insert({
              company_id: charge.company_id,
              type: 'income',
              amount: charge.amount,
              description: `Pagamento da cobrança ${charge.id}`,
              payment_method: 'pix',
              charge_id: charge.id
            })

          if (transactionError) {
            console.error('Error creating transaction:', transactionError)
            throw transactionError
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})