import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user

    if (!user?.email) {
      throw new Error('Usuário não encontrado')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (customers.data.length === 0) {
      await supabaseClient
        .from('profiles')
        .update({ 
          subscription_status: 'inactive',
          subscription_id: null,
          subscription_end_date: null
        })
        .eq('id', user.id)

      return new Response(
        JSON.stringify({ status: 'inactive' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1
    })

    const status = subscriptions.data.length > 0 ? 'active' : 'inactive'
    const subscription = subscriptions.data[0]

    if (subscription) {
      await supabaseClient
        .from('profiles')
        .update({ 
          subscription_status: status,
          subscription_id: subscription.id,
          stripe_customer_id: customers.data[0].id,
          subscription_end_date: new Date(subscription.current_period_end * 1000)
        })
        .eq('id', user.id)
    } else {
      await supabaseClient
        .from('profiles')
        .update({ 
          subscription_status: 'inactive',
          subscription_id: null,
          subscription_end_date: null
        })
        .eq('id', user.id)
    }

    return new Response(
      JSON.stringify({ 
        status,
        end_date: subscription ? new Date(subscription.current_period_end * 1000) : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})