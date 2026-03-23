import { createServerFn } from '@tanstack/react-start'
import { ChargilyClient } from '@chargily/chargily-pay'

interface CreateCheckoutInput {
  orderNumber: string
  orderId: string
  totalAmount: number
  customerName: string
}

export const createChargilyCheckout = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as CreateCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_SECRET_KEY not configured')

    const client = new ChargilyClient({
      api_key: secretKey,
      mode: secretKey.startsWith('test_') ? 'test' : 'live',
    })

    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:3000'

    const checkout = await client.createCheckout({
      amount: data.totalAmount,
      currency: 'dzd',
      success_url: `${baseUrl}/success?orderNumber=${encodeURIComponent(data.orderNumber)}`,
      failure_url: `${baseUrl}/?payment=failed`,
      description: `طلب رقم ${data.orderNumber} - ${data.customerName}`,
      locale: 'ar',
      metadata: {
        orderNumber: data.orderNumber,
        orderId: data.orderId,
      },
    })

    return {
      checkoutUrl: checkout.checkout_url,
      checkoutId: checkout.id,
    }
  })
