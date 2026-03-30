import { createServerFn } from '@tanstack/react-start'
import { createChargilyCustomer, createChargilyCheckout as chargilyCheckout } from './chargilyApi'

interface CreateCheckoutInput {
  orderNumber: string
  orderId: string
  totalAmount: number
  customerName: string
  customerEmail?: string
  customerPhone?: string
}

export const createChargilyCheckout = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as CreateCheckoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env.CHARGILY_SECRET_KEY
    if (!secretKey) throw new Error('CHARGILY_SECRET_KEY not configured')

    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:3000'

    const customer = await createChargilyCustomer(
      secretKey,
      data.customerName,
      data.customerEmail || `${data.orderNumber}@store.local`,
    )

    const checkout = await chargilyCheckout(secretKey, {
      amount: data.totalAmount,
      currency: 'dzd',
      success_url: `${baseUrl}/success?orderNumber=${encodeURIComponent(data.orderNumber)}`,
      failure_url: `${baseUrl}/?payment=failed`,
      description: `طلب رقم ${data.orderNumber} - ${data.customerName}`,
      locale: 'ar',
      customer_id: customer.id,
      metadata: {
        orderNumber: data.orderNumber,
        orderId: data.orderId,
        customerEmail: data.customerEmail || '',
      },
    })

    return { checkoutUrl: checkout.checkout_url, checkoutId: checkout.id }
  })
