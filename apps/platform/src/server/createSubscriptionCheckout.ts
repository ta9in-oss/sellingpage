import { createServerFn } from '@tanstack/react-start'
import { init, id } from '@instantdb/admin'
import {
  createChargilyCustomer,
  createChargilyCheckout,
} from './chargilyApi'
import { TIER_CHARGE_DZD, tierById } from '@/config/pricing'

interface SubscriptionCheckoutInput {
  tier: 'starter' | 'pro' | 'agency'
  userId: string
  userEmail: string
}

export const createSubscriptionCheckout = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as SubscriptionCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_PLATFORM_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_PLATFORM_SECRET_KEY not configured')

    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:3001'
    // Contact-sales tiers (e.g. Run One) are absent from the charge map on purpose —
    // they must never hit Chargily. Only chargily tiers have an amount here.
    const amount = TIER_CHARGE_DZD[data.tier]
    if (!amount) throw new Error(`Tier not purchasable via checkout: ${data.tier}`)
    const tierNameAr = tierById(data.tier)?.name.ar ?? data.tier

    // Create customer (identity shown in Chargily dashboard)
    const customer = await createChargilyCustomer(secretKey, data.userEmail, data.userEmail)

    // {checkout_id} placeholder is rejected by Chargily — checkoutId stored in DB instead
    const checkout = await createChargilyCheckout(secretKey, {
      amount,
      currency: 'dzd',
      success_url: `${baseUrl}/dashboard?payment=success&tier=${data.tier}`,
      failure_url: `${baseUrl}/dashboard?payment=failed`,
      description: `اشتراك باقة ${tierNameAr} - 7aba`,
      locale: 'ar',
      customer_id: customer.id,
      metadata: {
        tier: data.tier,
        userId: data.userId,
        userEmail: data.userEmail,
      },
    })

    const checkoutId = checkout.id

    // Persist checkoutId so the success handler can verify without URL param
    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })

    const result = await adminDb.query({
      platformUsers: { $: { where: { email: data.userEmail } } },
    })
    const existing = (result.platformUsers as { id: string }[] | undefined)?.[0]

    if (existing) {
      await adminDb.transact([adminDb.tx.platformUsers[existing.id].update({ checkoutId })])
    } else {
      const newId = id()
      await adminDb.transact([
        adminDb.tx.platformUsers[newId].update({
          email: data.userEmail.toLowerCase().trim(),
          checkoutId,
        }),
      ])
    }

    return { checkoutUrl: checkout.checkout_url, checkoutId }
  })
