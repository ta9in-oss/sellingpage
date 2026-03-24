import { createServerFn } from '@tanstack/react-start'
import { ChargilyClient } from '@chargily/chargily-pay'
import { init, id } from '@instantdb/admin'

interface VerifyPaymentInput {
  checkoutId: string
  tier: 'starter' | 'pro' | 'agency'
  userEmail: string
}

export const verifySubscriptionPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as VerifyPaymentInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_PLATFORM_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_PLATFORM_SECRET_KEY not configured')

    const client = new ChargilyClient({
      api_key: secretKey,
      mode: secretKey.startsWith('test_') ? 'test' : 'live',
    })

    const checkout = await client.getCheckout(data.checkoutId)
    const isPaid = checkout.status === 'paid'

    if (!isPaid) {
      return { success: false, status: checkout.status as string }
    }

    // Grant the tier to the user in our platform DB
    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANT_ADMIN_TOKEN!,
    })

    // Look up existing platformUser record by email
    const result = await adminDb.query({
      platformUsers: { $: { where: { email: data.userEmail } } },
    })
    const existing = result.platformUsers?.[0] as { id: string } | undefined

    if (existing) {
      await adminDb.transact([
        adminDb.tx.platformUsers[existing.id].update({
          tier: data.tier,
          checkoutId: data.checkoutId,
          purchasedAt: new Date(),
        }),
      ])
    } else {
      const newId = id()
      await adminDb.transact([
        adminDb.tx.platformUsers[newId].update({
          email: data.userEmail.toLowerCase().trim(),
          tier: data.tier,
          checkoutId: data.checkoutId,
          purchasedAt: new Date(),
        }),
      ])
    }

    return { success: true, status: 'paid', tier: data.tier }
  })
