// src/app/api/webhooks/stripe/route.ts
// Recebe eventos do Stripe e atualiza o status da assinatura no banco

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {

    // Assinatura criada com sucesso — ativar plano
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const responsavelId = session.metadata?.responsavel_id

      if (responsavelId) {
        await supabase.from('users').update({
          plano_ativo: true,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        }).eq('id', responsavelId)

        await supabase.from('assinaturas').insert({
          responsavel_id: responsavelId,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          status: 'active',
        })
      }
      break
    }

    // Pagamento recorrente confirmado
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase.from('assinaturas')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', invoice.subscription as string)
      break
    }

    // Pagamento falhou
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await supabase.from('assinaturas')
        .update({ status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', invoice.subscription as string)

      // Desativar plano temporariamente
      const { data: assinatura } = await supabase
        .from('assinaturas').select('responsavel_id')
        .eq('stripe_subscription_id', invoice.subscription as string).single()

      if (assinatura) {
        await supabase.from('users')
          .update({ plano_ativo: false }).eq('id', assinatura.responsavel_id)
      }
      break
    }

    // Assinatura cancelada
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('assinaturas')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id)

      const { data: assinatura } = await supabase
        .from('assinaturas').select('responsavel_id')
        .eq('stripe_subscription_id', sub.id).single()

      if (assinatura) {
        await supabase.from('users')
          .update({ plano_ativo: false }).eq('id', assinatura.responsavel_id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
