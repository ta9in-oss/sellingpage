import { useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import {
  ThemeProvider,
  HeroSection,
  FAQSection,
  GuaranteeSection,
  TestimonialSection,
  FeatureGrid,
} from '@7aba/store-ui'
import type { Section } from '@7aba/store-ui'
import type {
  HeroContent,
  FAQItem,
  Guarantee,
  Testimonial,
  Feature,
} from '@7aba/store-ui'
import { Monitor, Smartphone } from 'lucide-react'

function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case 'hero': {
      const content: HeroContent = {
        title: [section.headline],
        description: section.subheadline,
        ctaText: section.cta,
        ctaLink: '#buy',
        image: section.image ?? '',
        priceTag: { amount: '0', currency: 'DZD' },
        freeDelivery: true,
      }
      return <HeroSection content={content} />
    }

    case 'features': {
      const features: Feature[] = section.items.map((item) => ({
        image: item.icon,
        title: item.title,
        description: item.body,
        bgColor: '#F3F4F6',
      }))
      return <FeatureGrid title="المميزات" features={features} />
    }

    case 'testimonials': {
      const testimonials: Testimonial[] = section.items.map((item, i) => ({
        id: i + 1,
        name: item.name,
        rating: item.rating,
        comment: item.text,
      }))
      return <TestimonialSection testimonials={testimonials} title="آراء العملاء" />
    }

    case 'faq': {
      const faqs: FAQItem[] = section.items.map((item, i) => ({
        id: i + 1,
        question: item.q,
        answer: item.a,
      }))
      return <FAQSection faqs={faqs} title="الأسئلة الشائعة" />
    }

    case 'guarantee': {
      const guarantees: Guarantee[] = [
        {
          icon: section.icon,
          title: 'ضماننا',
          description: section.text,
        },
      ]
      return <GuaranteeSection guarantees={guarantees} title="الضمان" />
    }

    case 'order-form': {
      return (
        <div className="py-12 px-6 bg-zinc-50 text-center">
          <p className="text-zinc-500 font-medium">📋 نموذج الطلب</p>
          <p className="text-sm text-zinc-400 mt-1">{section.submitLabel}</p>
        </div>
      )
    }

    default:
      return null
  }
}

export function StorePreview() {
  const { config } = useBuilderStore()
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  const isDesktop = viewMode === 'desktop'

  return (
    <div className="flex flex-col h-full">
      {/* Device toggle */}
      <div className="flex justify-center gap-2 py-2 border-b border-zinc-200 bg-white shrink-0">
        <button
          onClick={() => setViewMode('desktop')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
            isDesktop
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-900'
          )}
        >
          <Monitor size={14} />
          سطح المكتب
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors',
            !isDesktop
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-500 hover:text-zinc-900'
          )}
        >
          <Smartphone size={14} />
          جوال
        </button>
      </div>

      {/* Scale wrapper */}
      <div className="flex-1 overflow-auto bg-zinc-100 flex justify-center p-4">
        <div
          style={{
            width: isDesktop ? '1200px' : '390px',
            transform: `scale(${isDesktop ? 0.55 : 0.75})`,
            transformOrigin: 'top center',
            marginBottom: isDesktop ? '-45%' : '-25%',
          }}
        >
          <div className="rounded-2xl border-4 border-zinc-800 overflow-hidden shadow-2xl bg-white">
            <ThemeProvider value={config.theme}>
              {config.sections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
              ))}
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
