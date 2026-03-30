import { createServerFn } from '@tanstack/react-start'
import { ChargilyClient } from '@chargily/chargily-pay'
import { init, id } from '@instantdb/admin'

interface SubscriptionCheckoutInput {
  tier: 'starter' | 'pro' | 'agency'
  userId: string
  userEmail: string
}

const TIER_PRICES: Record<string, number> = {
  starter: 3900,
  pro: 14900,
  agency: 49000,
}

const TIER_NAMES: Record<string, string> = {
  starter: 'مبتدئ',
  pro: 'احترافي',
  agency: 'وكالة',
}

export const createSubscriptionCheckout = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as SubscriptionCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_PLATFORM_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_PLATFORM_SECRET_KEY not configured')

    const client = new ChargilyClient({
      api_key: secretKey,
      mode: secretKey.startsWith('test_') ? 'test' : 'live',
    })

    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:3001'
    const amount = TIER_PRICES[data.tier]

    if (!amount) throw new Error(`Unknown tier: ${data.tier}`)

    // Create customer so their identity appears in Chargily dashboard
    const customer = await client.createCustomer({
      name: data.userEmail,
      email: data.userEmail,
    })

    // Success URL without {checkout_id} — Chargily rejects curly braces as invalid URL
    const checkout = await client.createCheckout({
      amount,
      currency: 'dzd',
      success_url: `${baseUrl}/dashboard?payment=success&tier=${data.tier}`,
      failure_url: `${baseUrl}/dashboard?payment=failed`,
      description: `اشتراك باقة ${TIER_NAMES[data.tier]} - 7aba.store`,
      locale: 'ar',
      customer_id: customer.id,
      metadata: {
        tier: data.tier,
        userId: data.userId,
        userEmail: data.userEmail,
      },
    })

    const checkoutId = checkout.id as string

    // Persist checkoutId to platformUsers so the success handler can verify without URL param
    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })

    const result = await adminDb.query({
      platformUsers: { $: { where: { email: data.userEmail } } },
    })
    const existing = (result.platformUsers as { id: string }[] | undefined)?.[0]

    if (existing) {
      await adminDb.transact([
        adminDb.tx.platformUsers[existing.id].update({ checkoutId }),
      ])
    } else {
      const newId = id()
      await adminDb.transact([
        adminDb.tx.platformUsers[newId].update({
          email: data.userEmail.toLowerCase().trim(),
          checkoutId,
        }),
      ])
    }

    return {
      checkoutUrl: checkout.checkout_url,
      checkoutId,
    }
  })
