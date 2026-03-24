// apps/platform/src/lib/configGenerator.ts
import type { StoreConfig } from '@7aba/store-ui'

export function generateSiteConfig(config: StoreConfig): string {
  const sectionTypes = config.sections.map((s) => s.type)
  const flags = {
    notifications: config.notifications.enabled,
    testimonials: sectionTypes.includes('testimonials'),
    faqs: sectionTypes.includes('faq'),
    guarantees: sectionTypes.includes('guarantee'),
    benefits: sectionTypes.includes('features'),
  }

  const paymentMethod = config.payment?.activeMethod ?? 'cod'

  return `// AUTO-GENERATED — do not edit manually
import type { SiteConfig } from './site.config.types'
import { ${config.theme.name}Theme } from './themes/${config.theme.name}'

export const siteConfig: SiteConfig = {
  theme: ${config.theme.name}Theme,
  features: {
    notifications: ${flags.notifications},
    testimonials: ${flags.testimonials},
    faqs: ${flags.faqs},
    guarantees: ${flags.guarantees},
    benefits: ${flags.benefits},
  },
  payment: {
    activeMethod: '${paymentMethod}',
  },
}
`
}

export function generateContentJson(config: StoreConfig): string {
  const content: Record<string, unknown> = {
    product: config.product,
    sections: config.sections,
    notifications: config.notifications,
    meta: config.meta,
  }
  return JSON.stringify(content, null, 2)
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
