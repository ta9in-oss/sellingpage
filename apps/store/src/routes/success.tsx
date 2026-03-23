import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { db } from '@/lib/instantdb'
import { Layout } from '@/components/Layout'
import { verifyChargilyPayment } from '@/server/verifyChargilyPayment'
import { CheckCircle, XCircle, Loader2, ShoppingBag, MapPin, Phone, Package } from 'lucide-react'

export const Route = createFileRoute('/success')({
  validateSearch: (search: Record<string, unknown>) => ({
    orderNumber: (search.orderNumber as string) || '',
  }),
  component: SuccessPage,
})

function SuccessPage() {
  const { orderNumber } = Route.useSearch()
  const navigate = useNavigate()
  const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'done'>('idle')
  const [paymentResult, setPaymentResult] = useState<{ paid: boolean; status: string } | null>(null)

  const { data, isLoading } = db.useQuery(
    orderNumber
      ? { orders: { $: { where: { order_number: orderNumber } }, product: {} } }
      : null
  )

  const order = data?.orders?.[0] as any

  useEffect(() => {
    if (!order || verifyState !== 'idle') return
    if (order.payment_method === 'chargily' && order.payment_status === 'pending' && order.chargily_checkout_id) {
      setVerifyState('verifying')
      verifyChargilyPayment({
        data: { checkoutId: order.chargily_checkout_id, orderId: order.id },
      })
        .then((result) => setPaymentResult(result))
        .catch(() => setPaymentResult({ paid: false, status: 'error' }))
        .finally(() => setVerifyState('done'))
    } else {
      setVerifyState('done')
    }
  }, [order])

  const isCod = order?.payment_method === 'cod' || !order?.payment_method
  const isChargilyPaid =
    order?.payment_method === 'chargily' &&
    (order?.payment_status === 'paid' || paymentResult?.paid === true)
  const isChargilyFailed =
    order?.payment_method === 'chargily' &&
    verifyState === 'done' &&
    !isChargilyPaid &&
    order?.payment_status !== 'pending'
  const isSuccess = isCod || isChargilyPaid

  if (!orderNumber) {
    return (
      <Layout showNavigation>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="border-4 border-black bg-yellow-400 p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-black mb-4">رقم الطلب غير موجود</h1>
            <button onClick={() => navigate({ to: '/' })} className="border-4 border-black bg-black text-white font-black px-6 py-3 hover:bg-yellow-400 hover:text-black transition-colors">
              العودة للرئيسية
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (isLoading || verifyState === 'verifying') {
    return (
      <Layout showNavigation>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="font-black text-xl">{verifyState === 'verifying' ? 'جاري التحقق من الدفع...' : 'جاري تحميل تفاصيل الطلب...'}</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout showNavigation>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="border-4 border-black bg-white p-8 max-w-md w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-black mb-2">الطلب غير موجود</h1>
            <p className="mb-6 text-gray-600">رقم الطلب: <span className="font-mono font-bold">{orderNumber}</span></p>
            <button onClick={() => navigate({ to: '/' })} className="border-4 border-black bg-black text-white font-black px-6 py-3 hover:bg-yellow-400 hover:text-black transition-colors">
              العودة للرئيسية
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showNavigation>
      <div className="min-h-[60vh] py-12 px-4 bg-white" dir="rtl">
        <div className="max-w-2xl mx-auto">

          <div className={"border-4 border-black p-8 mb-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] " + (isSuccess ? 'bg-yellow-400' : 'bg-red-100')}>
            {isSuccess ? (
              <>
                <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                <h1 className="text-4xl font-black mb-2">تم استلام طلبك! 🎉</h1>
                {isCod ? (
                  <p className="text-lg font-bold">سيتم التواصل معك قريباً لتأكيد الطلب</p>
                ) : (
                  <p className="text-lg font-bold">تم الدفع بنجاح — جاري تجهيز طلبك</p>
                )}
              </>
            ) : isChargilyFailed ? (
              <>
                <XCircle className="w-20 h-20 mx-auto mb-4 text-red-600" />
                <h1 className="text-4xl font-black mb-2">فشل الدفع</h1>
                <p className="text-lg font-bold">لم يتم إتمام عملية الدفع. يرجى المحاولة مرة أخرى.</p>
              </>
            ) : (
              <>
                <Loader2 className="w-20 h-20 mx-auto mb-4 animate-spin" />
                <h1 className="text-4xl font-black mb-2">في انتظار تأكيد الدفع</h1>
                <p className="text-lg font-bold">سيتم تحديث حالة طلبك بمجرد تأكيد الدفع</p>
              </>
            )}
          </div>

          <div className="border-4 border-black bg-white p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg">رقم الطلب</span>
              <span className="font-mono font-black text-xl bg-black text-yellow-400 px-4 py-1">{order.order_number}</span>
            </div>
          </div>

          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="border-b-4 border-black px-6 py-4 bg-black">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> تفاصيل الطلب
              </h2>
            </div>
            <div className="divide-y-4 divide-black">
              <div className="px-6 py-4 flex items-center gap-3">
                <Package className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-bold">المنتج</p>
                  <p className="font-black">{order.product?.name || 'المنتج المطلوب'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-bold">الكمية</p>
                  <p className="font-black text-xl">x{order.quantity}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 font-bold">المعلومات الشخصية</p>
                  <p className="font-black">{order.customer_name}</p>
                  <p className="font-mono font-bold">{order.customer_phone}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 font-bold">العنوان</p>
                  <p className="font-bold">{order.customer_address}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex justify-between items-center bg-yellow-400 border-t-4 border-black">
                <span className="font-black text-xl">المجموع</span>
                <span className="font-black text-2xl">{Number(order.total_amount).toLocaleString()} دج</span>
              </div>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-4 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
            <span className="font-black">طريقة الدفع</span>
            {isCod ? (
              <span className="border-2 border-black bg-yellow-400 font-black px-4 py-1">عند الاستلام</span>
            ) : (
              <span className={"border-2 border-black font-black px-4 py-1 " + (isChargilyPaid ? 'bg-green-400' : 'bg-red-200')}>
                {isChargilyPaid ? 'دفع إلكتروني ✓' : 'دفع إلكتروني'}
              </span>
            )}
          </div>

          {isChargilyFailed && (
            <div className="border-4 border-black bg-red-100 p-6 mb-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold mb-4">يمكنك إعادة المحاولة أو الطلب مرة أخرى</p>
              <button onClick={() => navigate({ to: '/' })} className="border-4 border-black bg-black text-white font-black px-8 py-3 hover:bg-yellow-400 hover:text-black transition-colors">
                أعد الطلب
              </button>
            </div>
          )}

          {isSuccess && (
            <div className="text-center">
              <button onClick={() => navigate({ to: '/' })} className="border-4 border-black bg-black text-white font-black px-8 py-3 hover:bg-yellow-400 hover:text-black transition-colors text-lg">
                العودة للرئيسية
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
