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
  }
}

export type Section =
  | { id: string; type: 'hero'; headline: string; subheadline: string; cta: string; image?: string }
  | { id: string; type: 'features'; items: { icon: string; title: string; body: string }[] }
  | { id: string; type: 'testimonials'; items: { name: string; text: string; rating: number }[] }
  | { id: string; type: 'faq'; items: { q: string; a: string }[] }
  | { id: string; type: 'guarantee'; text: string; icon: string }
  | { id: string; type: 'order-form'; submitLabel: string; fields: FormField[] }

export interface FormField {
  id: string
  label: string
  type: 'text' | 'phone' | 'select'
  required: boolean
}
