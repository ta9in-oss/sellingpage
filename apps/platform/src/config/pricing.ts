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
export const FIRST_BATCH_DEADLINE = new Date('2026-08-15T23:59:59+01:00')

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
  /** Normal (post-batch) price, shown struck-through above the batch price. Display only. */
  normalPriceLabel: Tri
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
    // 2000 is the majority-weight test variant (see STARTER_VARIANT_WEIGHTS) —
    // used here only as the static/SSR fallback before a visitor's assigned
    // variant is known. Actual displayed/charged price comes from
    // lib/starterPriceVariant.ts everywhere a buyer can see or pay this price.
    priceDzd: 2000,
    priceLabel: { ar: '2,000 دج', fr: '2 000 DZD', en: '2,000 DZD' },
    normalPriceLabel: { ar: '5,000 دج', fr: '5 000 DZD', en: '5,000 DZD' },
    afterLabel: {
      ar: 'لأول 100 مشترك فقط بهذا السعر — بعدها السعر العادي',
      fr: 'Pour les 100 premiers seulement — ensuite le prix normal',
      en: 'First 100 subscribers only — then the normal price',
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
    priceDzd: 7000,
    priceLabel: { ar: '7,000 دج', fr: '7 000 DZD', en: '7,000 DZD' },
    normalPriceLabel: { ar: '20,000 دج', fr: '20 000 DZD', en: '20,000 DZD' },
    afterLabel: {
      ar: 'لأول 10 مشتركين فقط بهذا السعر — بعدها السعر العادي',
      fr: 'Pour les 10 premiers seulement — ensuite le prix normal',
      en: 'First 10 subscribers only — then the normal price',
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
    priceDzd: 100000,
    priceLabel: { ar: '100,000 دج', fr: '100 000 DZD', en: '100,000 DZD' },
    normalPriceLabel: { ar: '200,000 دج', fr: '200 000 DZD', en: '200,000 DZD' },
    afterLabel: {
      ar: 'لأول 3 مشتركين فقط بهذا السعر — بعدها السعر العادي',
      fr: 'Pour les 3 premiers seulement — ensuite le prix normal',
      en: 'First 3 subscribers only — then the normal price',
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

/**
 * Starter is price-tested across visitors instead of having one fixed price.
 * Weights are traffic share, not probability out of 1 — pickStarterVariant
 * (lib/starterPriceVariant.ts) normalizes by their sum.
 */
export const STARTER_PRICE_VARIANTS = [1000, 2000, 3000] as const
export const STARTER_VARIANT_WEIGHTS: Record<number, number> = { 1000: 25, 2000: 50, 3000: 25 }
export const STARTER_NORMAL_DZD = 5000

/** Verbatim label shown next to the starter price — not translated, shown as-is in every language. */
export const FLEXY_LABEL = 'قيس فليكسي'

export function formatDzdLabel(amountDzd: number): Tri {
  const n = amountDzd.toLocaleString('en-US')
  return { ar: `${n} دج`, fr: `${n} DZD`, en: `${n} DZD` }
}

/** WhatsApp deep link prefilled for a Run One inquiry. */
export function contactWhatsappUrl(message: string): string {
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`
}

/** Shared one-time-payment label. */
export const ONCE_LABEL: Tri = { ar: 'دفعة واحدة', fr: 'Paiement unique', en: 'One-time payment' }

/** First-batch urgency label used near the countdown. */
export const FIRST_BATCH_LABEL: Tri = {
  ar: 'أسعار الدفعة الأولى — حتى 15 أوت 2026',
  fr: 'Tarifs 1re vague — jusqu\'au 15 août 2026',
  en: 'First-batch pricing — until 15 August 2026',
}
