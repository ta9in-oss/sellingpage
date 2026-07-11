import type { StoreConfig } from '@7aba/store-ui'

// A representative merchant config exercising multiple section mappings.
// The e2e asserts the STORE renders files produced by the platform generator
// from THIS config — proving the deploy pipeline's output is user-visible.
export const E2E_STORE_CONFIG: StoreConfig = {
  meta: { name: 'متجر الاختبار', slug: 'e2e-shop', locale: 'ar', rtl: true, siteTitle: 'متجر الاختبار', siteDescription: 'متجر لاختبار النشر' },
  theme: { name: 'brutalist', direction: 'rtl', mode: 'light' } as StoreConfig['theme'],
  product: { name: 'حقيبة الاختبار', price: 4321, currency: 'DZD', images: ['/bagpack_001.png', '/bagpack_002.png'] },
  notifications: { enabled: false, message: '' },
  sections: [
    { id: 'h', type: 'hero', headline: 'عنوان_فريد_للاختبار', subheadline: 'وصف المنتج التجريبي', cta: 'اطلب الآن', image: '/bagpack_001.png', freeDelivery: true },
    { id: 'f', type: 'features', title: 'مميزات الاختبار', items: [{ icon: '/bagpack_005.png', title: 'ميزة أولى', body: 'شرح الميزة' }] },
    { id: 'o', type: 'order-form', title: 'اطلب الآن', submitLabel: 'أكمل الطلب', fields: [] },
  ],
  payment: { activeMethod: 'cod' },
}
