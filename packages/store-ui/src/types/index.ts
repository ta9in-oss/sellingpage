import type { Theme } from '../themes/theme.types'

export type {
  HeroContent,
  Feature,
  ProductImage,
  Testimonial,
  FAQItem,
  Guarantee,
  Benefit,
  UrgencyConfig,
  OrderLayoutConfig,
  OrderLayoutType,
  ComparisonItem,
  SiteContent,
} from './content.types'

export interface StoreConfig {
  meta: {
    name: string
    slug: string
    locale: 'ar' | 'fr' | 'en'
    rtl: boolean
    siteTitle?: string
    siteDescription?: string
    /** Store logo — a media-library URL shown in the header/footer. */
    logo?: string
  }
  theme: Theme
  sections: Section[]
  product: {
    name: string
    price: number
    currency: 'DZD' | 'USD'
    images: string[]
  }
  notifications: {
    enabled: boolean
    message: string
    /** FOMO popup visual preset. */
    style?: 'brutalist' | 'soft' | 'minimal' | 'dark'
  }
  payment?: {
    /** Which payment method is active for this store. Configured by the merchant, not shown to buyers. */
    activeMethod: 'cod' | 'chargily' | 'both'
    /** Chargily Pay API key — stored in platform DB and deployed as Worker secret, not in client bundle. */
    chargilyApiKey?: string
  }
}

export type Section =
  | { id: string; type: 'hero'; headline: string; subheadline: string; cta: string; image?: string; freeDelivery?: boolean }
  | { id: string; type: 'features'; title?: string; items: { icon: string; title: string; body: string; image?: string }[] }
  | { id: string; type: 'testimonials'; title?: string; items: { name: string; text: string; rating: number; location?: string }[] }
  | { id: string; type: 'faq'; title?: string; items: { q: string; a: string }[] }
  | { id: string; type: 'guarantee'; title?: string; items: { title: string; description: string; icon: string }[] }
  | { id: string; type: 'order-form'; title?: string; submitLabel: string; fields: FormField[] }
  | { id: string; type: 'social-proof'; rating?: number; reviewCount?: number }
  | { id: string; type: 'cta'; headline: string; subheadline: string; cta: string }
  | { id: string; type: 'benefits'; title?: string; items: { icon: string; title: string; description: string }[] }
  | { id: string; type: 'value-stack'; ctaText: string; items: { icon: string; title: string; description: string; value: string; isFree: boolean }[] }
  | { id: string; type: 'product-carousel'; title?: string; images?: string[] }
  | { id: string; type: 'footer'; storeName: string; tagline?: string; phone?: string; email?: string; whatsapp?: string; copyright?: string }

export interface FormField {
  id: string
  label: string
  type: 'text' | 'phone' | 'select'
  required: boolean
}
