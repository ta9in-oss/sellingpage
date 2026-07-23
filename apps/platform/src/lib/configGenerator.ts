// apps/platform/src/lib/configGenerator.ts
import type { StoreConfig, Section, SiteContent } from '@7aba/store-ui'

const BG_CYCLE = ['bg-yellow-400 text-black', 'bg-black text-white', 'bg-white text-black']
const bg = (i: number) => BG_CYCLE[i % BG_CYCLE.length]

const CURRENCY_LABEL: Record<StoreConfig['product']['currency'], string> = {
  DZD: 'دج',
  USD: '$',
}

function find<T extends Section['type']>(config: StoreConfig, type: T) {
  return config.sections.find((s) => s.type === type) as Extract<Section, { type: T }> | undefined
}

export function generateContent(config: StoreConfig): SiteContent {
  const hero = find(config, 'hero')
  const features = find(config, 'features')
  const testimonials = find(config, 'testimonials')
  const faq = find(config, 'faq')
  const guarantee = find(config, 'guarantee')
  const benefits = find(config, 'benefits')
  const cta = find(config, 'cta')
  const carousel = find(config, 'product-carousel')

  const carouselImages = carousel?.images?.length ? carousel.images : config.product.images

  const content: SiteContent = {
    hero: {
      title: hero ? [hero.headline] : [config.product.name],
      description: hero?.subheadline ?? '',
      ctaText: hero?.cta ?? 'اشتر الآن',
      ctaLink: '#buy',
      image: hero?.image ?? config.product.images[0] ?? '',
      priceTag: { amount: String(config.product.price), currency: CURRENCY_LABEL[config.product.currency] },
      freeDelivery: hero?.freeDelivery ?? false,
    },
    features: (features?.items ?? []).map((it, i) => ({
      image: it.icon,
      title: it.title,
      description: it.body,
      bgColor: bg(i),
    })),
    productImages: carouselImages.map((image, i) => ({
      id: i + 1,
      image,
      title: config.product.name,
      bgColor: bg(i),
    })),
    sections: {
      specs: { title: features?.title ?? 'المميزات' },
      order: { title: 'اطلب الآن' },
      ...(testimonials ? { testimonials: { title: testimonials.title ?? 'آراء العملاء' } } : {}),
      ...(faq ? { faq: { title: faq.title ?? 'أسئلة شائعة' } } : {}),
    },
  }

  if (testimonials) {
    content.testimonials = testimonials.items.map((t, i) => ({
      id: i + 1,
      name: t.name,
      comment: t.text,
      rating: t.rating,
      location: t.location,
    }))
  }
  if (faq) {
    content.faqs = faq.items.map((f, i) => ({ id: i + 1, question: f.q, answer: f.a }))
  }
  if (guarantee) {
    content.guarantees = guarantee.items.map((g) => ({ icon: g.icon, title: g.title, description: g.description }))
  }
  if (benefits) {
    content.benefits = benefits.items.map((b) => ({ icon: b.icon, title: b.title, description: b.description }))
  }
  if (cta) {
    content.cta = { title: cta.headline, subtitle: cta.subheadline, buttonText: cta.cta }
  }

  return content
}

export function generateContentJson(config: StoreConfig): string {
  return JSON.stringify(generateContent(config), null, 2)
}

export function generateSiteConfig(config: StoreConfig): string {
  const themeName = config.theme.name
  const has = (type: Section['type']) => config.sections.some((s) => s.type === type)
  const paymentMethod = config.payment?.activeMethod === 'both' ? 'chargily' : config.payment?.activeMethod ?? 'cod'

  return `// AUTO-GENERATED — do not edit manually
import { ${themeName}Theme } from './themes/${themeName}';
import type { Theme } from './themes/theme.types';

export const siteConfig = {
  theme: ${themeName}Theme as Theme,
  site: {
    name: ${JSON.stringify(config.meta.name)},
    description: ${JSON.stringify(config.meta.siteDescription ?? '')},
    url: ${JSON.stringify(`https://${config.meta.slug}.pages.dev`)},
    logo: '/assets/logo/7aba_store_logo_i1.svg',
  },
  features: {
    notifications: ${config.notifications.enabled},
    testimonials: ${has('testimonials')},
    faqs: ${has('faq')},
    guarantees: ${has('guarantee')},
    benefits: ${has('benefits')},
    comparison: false,
    urgency: false,
    multiProduct: false,
  },
  payment: {
    activeMethod: '${paymentMethod}' as 'cod' | 'chargily',
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
  },
  defaultProduct: {
    productNumber: ${JSON.stringify(config.meta.slug)},
  },
} as const;
`
}

export function generateWranglerToml(config: StoreConfig, cfAccountId: string): string {
  return `name = "${config.meta.slug}"
main = ".output/server/index.mjs"
compatibility_date = "2024-01-01"
account_id = "${cfAccountId}"

[site]
bucket = ".output/public"
`
}
