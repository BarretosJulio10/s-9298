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
  // Handle CORS
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

    // Buscar as credenciais do Mercado Pago da empresa
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
      console.log('Creating charge with Mercado Pago:', charge)
      
      // Formatar a data para o formato esperado pelo Mercado Pago
      const dueDate = new Date(charge.due_date)
      dueDate.setHours(23, 59, 59)
      const formattedDueDate = dueDate.toISOString()
      
      // Gerar um ID de idempotência único baseado nos dados da cobrança
      const idempotencyKey = crypto.randomUUID()
      
      const baseUrl = gatewaySettings.environment === 'production' 
        ? 'https://api.mercadopago.com'
        : 'https://api.mercadopago.com'

      const response = await fetch(`${baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gatewaySettings.api_key}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          transaction_amount: charge.amount,
          description: `Cobrança para ${charge.customer_name}`,
          payment_method_id: charge.payment_method === 'credit_card' ? 'credit_card' : 'pix',
          payer: {
            email: charge.customer_email,
            identification: {
              type: charge.customer_document.length > 11 ? 'CNPJ' : 'CPF',
              number: charge.customer_document.replace(/\D/g, ''),
            },
            first_name: charge.customer_name.split(' ')[0],
            last_name: charge.customer_name.split(' ').slice(1).join(' '),
          },
          date_of_expiration: formattedDueDate,
        }),
      })

      const mpResponse = await response.json()
      console.log('Mercado Pago response:', mpResponse)

      if (!response.ok) {
        throw new Error(`Erro ao criar cobrança: ${mpResponse.message || JSON.stringify(mpResponse)}`)
      }

      return new Response(
        JSON.stringify({
          id: mpResponse.id,
          status: mpResponse.status,
          payment_link: mpResponse.point_of_interaction?.transaction_data?.ticket_url || '',
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