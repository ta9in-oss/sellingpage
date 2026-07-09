/**
 * Single source of truth for platform pricing + the first-batch FOMO offer.
 *
 * Every pricing surface (landing, /pricing, post-login gate, checkout, deploy
 * wizard, structured data) imports from here so display and charge can never
 * drift apart again. Pure data only — no `import.meta`/`process.env` — so it is
 * safe to import from both client components and server functions.
 *
 * Internal tier ids ('starter' | 'pro' | 'agency') are a CONTRACT with the
 * database (platformUsers), Chargily `metadata.tier`, and the `?tier=` success
 * URL. Never rename them; only the display `name` changes.
 */

export type Lang = 'ar' | 'fr' | 'en'
export type Tri = Record<Lang, string>

export type TierId = 'starter' | 'pro' | 'agency'
export type CheckoutKind = 'chargily' | 'contact'

/** First-batch offer deadline — Algiers time (UTC+1). After this, prices rise. */
export const FIRST_BATCH_DEADLINE = new Date('2026-07-31T23:59:59+01:00')

export function isFirstBatch(now: Date = new Date()): boolean {
  return now.getTime() < FIRST_BATCH_DEADLINE.getTime()
}

/** ta9in contact channels for the Run One (contact-sales) tier. */
export const CONTACT_WHATSAPP = '213553816920'
export const CONTACT_EMAIL = 'support@7aba.app'

export interface Tier {
  id: TierId
  name: Tri
  /** First-batch price in DZD. For `chargily` tiers this is the exact amount charged. */
  priceDzd: number
  /** Formatted first-batch price for display. */
  priceLabel: Tri
  /** What the tier becomes after the deadline — drives the FOMO contrast (display only). */
  afterLabel: Tri
  checkout: CheckoutKind
  badge: Tri | null
  accent: boolean
  features: Record<Lang, string[]>
}

export const TIERS: Tier[] = [
  {
    id: 'starter',
    name: { ar: 'المبتدئ', fr: 'Starter', en: 'Starter' },
    priceDzd: 10000,
    priceLabel: { ar: '10,000 دج', fr: '10 000 DZD', en: '10,000 DZD' },
    afterLabel: {
      ar: 'بعد 31 جويلية: 10 متاجر فقط، ثم 3,000 دج لكل متجر إضافي',
      fr: 'Après le 31 juillet : 10 boutiques, puis 3 000 DZD par boutique',
      en: 'After Jul 31: 10 stores only, then 3,000 DZD per extra store',
    },
    checkout: 'chargily',
    badge: null,
    accent: false,
    features: {
      ar: [
        'متاجر غير محدودة — للأبد (عرض الدفعة الأولى)',
        'محرر بصري كامل (12 نوع قسم)',
        '3 ثيمات احترافية + تخصيص كامل',
        'دفع عند الاستلام (COD). مجاني دائماً',
        'دفع إلكتروني Chargily Pay (CIB، Dahabia)',
        'نطاق مخصص عبر Cloudflare',
        'لوحة إدارة الطلبات',
        'Google Analytics + Clarity',
      ],
      fr: [
        'Boutiques illimitées — à vie (offre 1re vague)',
        'Éditeur visuel complet (12 types de sections)',
        '3 thèmes professionnels + personnalisation',
        'Paiement à la livraison (COD). toujours gratuit',
        'Paiement en ligne Chargily Pay (CIB, Dahabia)',
        'Domaine personnalisé via Cloudflare',
        'Tableau de bord commandes',
        'Google Analytics + Clarity',
      ],
      en: [
        'Unlimited stores — forever (first-batch offer)',
        'Full visual builder (12 section types)',
        '3 professional themes + full customisation',
        'Cash on Delivery (COD). always free',
        'Online payment via Chargily Pay (CIB, Dahabia)',
        'Custom domain via Cloudflare',
        'Orders management dashboard',
        'Google Analytics + Clarity',
      ],
    },
  },
  {
    id: 'pro',
    name: { ar: 'المستقل', fr: 'Freelancer', en: 'Freelancer' },
    priceDzd: 70000,
    priceLabel: { ar: '70,000 دج', fr: '70 000 DZD', en: '70,000 DZD' },
    afterLabel: {
      ar: 'بعد 31 جويلية: 100,000 دج',
      fr: 'Après le 31 juillet : 100 000 DZD',
      en: 'After Jul 31: 100,000 DZD',
    },
    checkout: 'chargily',
    badge: { ar: 'الأكثر اختياراً', fr: 'Le plus choisi', en: 'Most chosen' },
    accent: true,
    features: {
      ar: ['كل ما في باقة المبتدئ', 'تحميل كود مصدر المتجر فوراً', 'دعم ذو أولوية'],
      fr: ['Tout ce qui est dans Starter', 'Télécharger le code source de la boutique', 'Support prioritaire'],
      en: ['Everything in Starter', 'Download store source code instantly', 'Priority support'],
    },
  },
  {
    id: 'agency',
    name: { ar: 'الوكالة', fr: 'Run One', en: 'Run One' },
    priceDzd: 1000000,
    priceLabel: { ar: '1,000,000 دج', fr: '1 000 000 DZD', en: '1,000,000 DZD' },
    afterLabel: {
      ar: 'بعد 31 جويلية: 2,000,000 دج',
      fr: 'Après le 31 juillet : 2 000 000 DZD',
      en: 'After Jul 31: 2,000,000 DZD',
    },
    checkout: 'contact',
    badge: null,
    accent: false,
    features: {
      ar: [
        'كل ما في باقة المستقل',
        'نُجهّز لك منصة كاملة مثل حبة',
        'تصلك التحديثات عند صدورها أولاً بأول',
        'متاجر غير محدودة + دعم مباشر',
      ],
      fr: [
        'Tout ce qui est dans Freelancer',
        'Nous configurons une plateforme complète comme 7aba',
        'Vous recevez les mises à jour en premier',
        'Boutiques illimitées + support direct',
      ],
      en: [
        'Everything in Freelancer',
        'We set up a full platform like 7aba for you',
        'You get updates first, as we ship them',
        'Unlimited client stores + direct support',
      ],
    },
  },
]

/** Exact DZD amounts charged via Chargily, keyed by tier id. Contact tiers are absent. */
export const TIER_CHARGE_DZD: Partial<Record<TierId, number>> = Object.fromEntries(
  TIERS.filter((t) => t.checkout === 'chargily').map((t) => [t.id, t.priceDzd]),
) as Partial<Record<TierId, number>>

export function tierById(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id)
}

/** WhatsApp deep link prefilled for a Run One inquiry. */
export function contactWhatsappUrl(message: string): string {
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`
}

/** Shared one-time-payment label. */
export const ONCE_LABEL: Tri = { ar: 'دفعة واحدة', fr: 'Paiement unique', en: 'One-time payment' }

/** First-batch urgency label used near the countdown. */
export const FIRST_BATCH_LABEL: Tri = {
  ar: 'أسعار الدفعة الأولى — تنتهي 31 جويلية 2026',
  fr: 'Tarifs 1re vague — fin le 31 juillet 2026',
  en: 'First-batch pricing — ends 31 July 2026',
}
