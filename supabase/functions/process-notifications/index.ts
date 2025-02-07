
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceRole)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting notification processing...')

    // Buscar todas as regras de notificação ativas
    const { data: rules, error: rulesError } = await supabase
      .from('notification_rules')
      .select(`
        *,
        message_templates (
          content
        )
      `)
      .eq('active', true)

    if (rulesError) throw rulesError

    // Buscar todas as cobranças que precisam de notificação
    const { data: charges, error: chargesError } = await supabase
      .from('charges')
      .select(`
        *,
        profiles (
          whatsapp
        )
      `)
      .in('status', ['pending', 'overdue'])
      .eq('notification_sent', false)

    if (chargesError) throw chargesError

    console.log(`Found ${charges?.length || 0} charges to process`)
    const notifications = []

    for (const charge of charges || []) {
      for (const rule of rules || []) {
        const dueDate = new Date(charge.due_date)
        const today = new Date()
        const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        // Verificar se a cobrança se enquadra nas regras de notificação
        if (
          (rule.days_before > 0 && diffDays === rule.days_before) || // Notificação antes
          (rule.days_after > 0 && diffDays === -rule.days_after) || // Notificação depois
          (diffDays === 0) // No dia
        ) {
          console.log(`Processing charge ${charge.id} with rule ${rule.id}`)
          
          // Preparar a mensagem
          const template = rule.message_templates?.content || ''
          const message = template
            .replace('{nome}', charge.customer_name)
            .replace('{valor}', new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(charge.amount))
            .replace('{vencimento}', new Date(charge.due_date).toLocaleDateString('pt-BR'))
            .replace('{link}', charge.payment_link || '')

          // Enviar notificação via WhatsApp
          if (charge.profiles?.whatsapp) {
            console.log(`Sending WhatsApp message to ${charge.profiles.whatsapp}`)
            
            const whatsappResponse = await fetch(`${supabaseUrl}/functions/v1/whatsapp`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceRole}`
              },
              body: JSON.stringify({
                action: 'sendMessage',
                params: {
                  phone: charge.profiles.whatsapp,
                  message: message
                }
              })
            })

            if (whatsappResponse.ok) {
              console.log(`WhatsApp message sent successfully for charge ${charge.id}`)
              
              // Registrar notificação enviada
              const { error: historyError } = await supabase
                .from('notification_history')
                .insert({
                  charge_id: charge.id,
                  type: 'whatsapp',
                  status: 'sent',
                  message: message
                })

              if (historyError) throw historyError

              // Atualizar status da notificação na cobrança
              const { error: updateError } = await supabase
                .from('charges')
                .update({
                  notification_sent: true,
                  notification_date: new Date().toISOString()
                })
                .eq('id', charge.id)

              if (updateError) throw updateError

              notifications.push({
                charge_id: charge.id,
                status: 'success'
              })
            } else {
              console.error(`Failed to send WhatsApp message for charge ${charge.id}`)
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, notifications }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
