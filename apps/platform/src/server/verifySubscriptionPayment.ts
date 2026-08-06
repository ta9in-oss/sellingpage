import { createServerFn } from '@tanstack/react-start'
import { init, id } from '@instantdb/admin'
import { getChargilyCheckout } from './chargilyApi'
import { generateFounderCode } from '../lib/founderCode'
import { event, createError } from '../lib/logger'

interface VerifyPaymentInput {
  checkoutId: string
  tier: 'starter' | 'pro' | 'agency'
  userEmail: string
}

export const verifySubscriptionPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as VerifyPaymentInput)
  .handler(async ({ data }) => {
    const log = event()
    const secretKey = process.env.CHARGILY_PLATFORM_SECRET_KEY
    if (!secretKey) throw createError({ message: 'CHARGILY_PLATFORM_SECRET_KEY not configured', status: 500 })

    const checkout = await getChargilyCheckout(secretKey, data.checkoutId)
    const isPaid = checkout.status === 'paid'

    if (!isPaid) {
      log.set({ payment: { checkoutId: data.checkoutId, tier: data.tier, status: checkout.status, outcome: 'not-paid' } })
      log.audit({ action: 'subscription.purchase', actor: { type: 'user', id: data.userEmail }, target: { type: 'tier', id: data.tier }, outcome: 'denied' })
      log.emit()
      return { success: false, status: checkout.status as string }
    }

    const adminDb = init({
      appId: process.env.VITE_INSTANT_APP_ID!,
      adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
    })

    const result = await adminDb.query({
      platformUsers: { $: { where: { email: data.userEmail } } },
    })
    const existing = (result.platformUsers as
      | { id: string; founderCode?: string }[]
      | undefined)?.[0]

    // Founder code is issued once and never regenerated — verify can run more
    // than once (retries, refresh), so we only mint it on the first paid pass.
    const founderCode = existing?.founderCode ?? generateFounderCode()

    if (existing) {
      await adminDb.transact([
        adminDb.tx.platformUsers[existing.id].update({
          tier: data.tier,
          checkoutId: data.checkoutId,
          purchasedAt: new Date(),
          founderCode,
          founderBatch: '1',
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
          founderCode,
          founderBatch: '1',
        }),
      ])
    }

    log.set({ payment: { checkoutId: data.checkoutId, tier: data.tier, outcome: 'paid', newUser: !existing } })
    log.audit({ action: 'subscription.purchase', actor: { type: 'user', id: data.userEmail }, target: { type: 'tier', id: data.tier }, outcome: 'success' })
    log.emit()
    return { success: true, status: 'paid', tier: data.tier, founderCode }
  })
