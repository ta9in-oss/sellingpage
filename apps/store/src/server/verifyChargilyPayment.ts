import { createServerFn } from '@tanstack/react-start'
import { ChargilyClient } from '@chargily/chargily-pay'
import { init } from '@instantdb/admin'

interface VerifyPaymentInput {
  checkoutId: string
  orderId: string
}

export const verifyChargilyPayment = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as VerifyPaymentInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_SECRET_KEY not configured')

    const client = new ChargilyClient({
      api_key: secretKey,
      mode: secretKey.startsWith('test_') ? 'test' : 'live',
    })

    const checkout = await client.getCheckout(data.checkoutId)
    const isPaid = checkout.status === 'paid'

    if (isPaid) {
      const adminDb = init({
        appId: process.env.VITE_INSTANT_APP_ID!,
        adminToken: process.env.INSTANT_ADMIN_TOKEN!,
      })

      await adminDb.transact([
        adminDb.tx.orders[data.orderId].update({
          payment_status: 'paid',
          status: { label: 'مؤكد', value: 'confirmed' },
          updated_at: new Date(),
        }),
      ])
    } else if (checkout.status === 'canceled' || checkout.status === 'failed') {
      const adminDb = init({
        appId: process.env.VITE_INSTANT_APP_ID!,
        adminToken: process.env.INSTANT_ADMIN_TOKEN!,
      })

      await adminDb.transact([
        adminDb.tx.orders[data.orderId].update({
          payment_status: 'failed',
          updated_at: new Date(),
        }),
      ])
    }

    return {
      paid: isPaid,
      status: checkout.status as string,
    }
  })
