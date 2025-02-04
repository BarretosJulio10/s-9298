import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface MercadoPagoRequest {
  action: 'create_charge'
  charge: {
    customer_name: string
    customer_email: string
    customer_document: string
    amount: number
    due_date: string
    payment_method: string
  }
  company_id: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, charge, company_id }: MercadoPagoRequest = await req.json()
    console.log('Received request:', { action, charge, company_id })

    const { data: gatewaySettings, error: settingsError } = await supabaseClient
      .from('payment_gateway_settings')
      .select('*')
      .eq('company_id', company_id)
      .eq('gateway', 'mercadopago')
      .single()

    if (settingsError || !gatewaySettings) {
      console.error('Error fetching gateway settings:', settingsError)
      throw new Error('Credenciais do Mercado Pago não encontradas')
    }

    console.log('Gateway settings found:', gatewaySettings)

    if (action === 'create_charge') {
      const transactionAmount = parseFloat(charge.amount.toString())
      if (isNaN(transactionAmount) || transactionAmount <= 0) {
        throw new Error('O valor da transação deve ser maior que zero')
      }

      const cleanDocument = charge.customer_document.replace(/\D/g, '')
      const docType = cleanDocument.length > 11 ? 'CNPJ' : 'CPF'

      const idempotencyKey = crypto.randomUUID()
      const baseUrl = 'https://api.mercadopago.com'
      const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`

      console.log('Creating Mercado Pago payment:', {
        amount: transactionAmount,
        document: cleanDocument,
        docType,
        webhookUrl
      })

      const preferenceResponse = await fetch(`${baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gatewaySettings.api_key}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          items: [{
            title: `Cobrança para ${charge.customer_name}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: transactionAmount
          }],
          payer: {
            email: charge.customer_email,
            identification: {
              type: docType,
              number: cleanDocument
            },
            name: charge.customer_name
          },
          payment_methods: {
            excluded_payment_methods: [],
            excluded_payment_types: [],
            installments: 1
          },
          auto_return: "approved",
          back_urls: {
            success: "https://www.success.com",
            failure: "https://www.failure.com",
            pending: "https://www.pending.com"
          },
          notification_url: webhookUrl,
          statement_descriptor: "PAGOUPIX",
          external_reference: idempotencyKey,
        }),
      })

      const mpResponse = await preferenceResponse.json()
      console.log('Mercado Pago response:', mpResponse)

      if (!preferenceResponse.ok) {
        throw new Error(`Erro ao criar cobrança: ${mpResponse.message || JSON.stringify(mpResponse)}`)
      }

      return new Response(
        JSON.stringify({
          id: mpResponse.id,
          status: 'pending',
          payment_link: mpResponse.init_point,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    throw new Error('Ação não suportada')
  } catch (error) {
    console.error('Error in mercadopago function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})