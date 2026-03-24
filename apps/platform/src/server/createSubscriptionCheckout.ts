import { createServerFn } from '@tanstack/react-start'
import { ChargilyClient } from '@chargily/chargily-pay'

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

    const checkout = await client.createCheckout({
      amount,
      currency: 'dzd',
      // Chargily replaces {checkout_id} in success URLs automatically
      success_url: `${baseUrl}/dashboard?payment=success&tier=${data.tier}&checkout_id={checkout_id}`,
      failure_url: `${baseUrl}/dashboard?payment=failed`,
      description: `اشتراك باقة ${TIER_NAMES[data.tier]} - 7aba.store`,
      locale: 'ar',
      metadata: {
        tier: data.tier,
        userId: data.userId,
        userEmail: data.userEmail,
      },
    })

    return {
      checkoutUrl: checkout.checkout_url,
      checkoutId: checkout.id as string,
    }
  })
