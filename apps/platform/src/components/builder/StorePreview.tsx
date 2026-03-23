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
  OrderSection,
} from '@7aba/store-ui'
import type { Section, StoreConfig } from '@7aba/store-ui'
import type {
  HeroContent,
  FAQItem,
  Guarantee,
  Testimonial,
  Feature,
  ProductImage,
} from '@7aba/store-ui'
import { Monitor, Smartphone } from 'lucide-react'

// Placeholder product images used when merchant hasn't uploaded images yet
const PLACEHOLDER_IMAGES: ProductImage[] = [
  { id: 1, image: '/bagpack_002.png', title: 'صورة المنتج', bgColor: 'bg-black text-white' },
  { id: 2, image: '/bagpack_003.png', title: 'صورة المنتج', bgColor: 'bg-yellow-400 text-black' },
  { id: 3, image: '/bagpack_004.png', title: 'صورة المنتج', bgColor: 'bg-white text-black border-2 border-black' },
]

function SectionRenderer({ section, config }: { section: Section; config: StoreConfig }) {
  switch (section.type) {
    case 'hero': {
      const content: HeroContent = {
        title: [section.headline || 'عنوان منتجك هنا'],
        description: section.subheadline || 'صف منتجك في سطر أو سطرين. اجذب انتباه الزبون.',
        ctaText: section.cta || 'اطلب الآن',
        ctaLink: '#buy',
        image: section.image || '/bagpack_001.png',
        priceTag: {
          amount: config.product.price > 0 ? String(config.product.price) : '2500',
          currency: config.product.currency || 'دج',
        },
        freeDelivery: true,
      }
      return <HeroSection content={content} />
    }

    case 'features': {
      const features: Feature[] = section.items.length > 0
        ? section.items.map((item) => ({
            image: '',
            title: item.title,
            description: item.body,
            bgColor: 'bg-white text-black',
          }))
        : [
            { image: '/bagpack_005.png', title: 'ميزة أولى', description: 'اكتب وصف هذه الميزة هنا', bgColor: 'bg-yellow-400 text-black' },
            { image: '/bagpack_003.png', title: 'ميزة ثانية', description: 'اكتب وصف هذه الميزة هنا', bgColor: 'bg-white text-black' },
            { image: '/bagpack_004.png', title: 'ميزة ثالثة', description: 'اكتب وصف هذه الميزة هنا', bgColor: 'bg-black text-white' },
          ]
      return <FeatureGrid title="المميزات" features={features} />
    }

    case 'testimonials': {
      const testimonials: Testimonial[] = section.items.length > 0
        ? section.items.map((item, i) => ({
            id: i + 1,
            name: item.name,
            rating: item.rating,
            comment: item.text,
          }))
        : [
            { id: 1, name: 'أحمد بن علي', location: 'الجزائر', comment: 'منتج رائع! جودة ممتازة وتوصيل سريع', rating: 5 },
            { id: 2, name: 'فاطمة الزهراء', location: 'وهران', comment: 'راضية بزاف على الشراء، ننصح بيه', rating: 5 },
            { id: 3, name: 'محمد الأمين', location: 'قسنطينة', comment: 'المنتج كيما في الصور، سرعة التوصيل ممتازة', rating: 5 },
          ]
      return <TestimonialSection testimonials={testimonials} />
    }

    case 'faq': {
      const faqs: FAQItem[] = section.items.length > 0
        ? section.items.map((item, i) => ({
            id: i + 1,
            question: item.q,
            answer: item.a,
          }))
        : [
            { id: 1, question: 'كيفاش نطلب؟', answer: 'اكتب معلوماتك في الاستمارة وانتظر التأكيد.' },
            { id: 2, question: 'واش التوصيل مجاني؟', answer: 'إيه! التوصيل مجاني لكامل الوطن.' },
            { id: 3, question: 'كيفاش الدفع؟', answer: 'الدفع عند الاستلام فقط.' },
          ]
      return <FAQSection faqs={faqs} />
    }

    case 'guarantee': {
      // Support new items[] format; fall back gracefully for old text+icon format
      const guarantees: Guarantee[] = section.items && section.items.length > 0
        ? section.items.map((item) => ({ icon: item.icon, title: item.title, description: item.description }))
        : [
            { icon: 'truck', title: 'توصيل مجاني', description: 'توصيل مجاني لجميع الولايات' },
            { icon: 'refresh', title: 'إرجاع مجاني', description: 'عندك 7 أيام باش ترجع المنتج' },
            { icon: 'shield', title: 'ضمان الجودة', description: 'ضمان استرداد الأموال خلال 7 أيام' },
          ]
      return <GuaranteeSection guarantees={guarantees} />
    }

    case 'order-form': {
      const configImages: ProductImage[] = config.product.images.map((img, i) => ({
        id: i + 1,
        image: img,
        title: config.product.name || 'المنتج',
        bgColor: 'bg-zinc-100',
      }))
      const productImages = configImages.length > 0 ? configImages : PLACEHOLDER_IMAGES
      return (
        <OrderSection
          price={config.product.price > 0 ? config.product.price : 2500}
          totalStock={10}
          productImages={productImages}
          onSubmit={async () => {}}
          title={section.submitLabel || 'اطلب الآن'}
        />
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
          <div className="border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white">
            <ThemeProvider value={config.theme}>
              {config.sections.map((section) => (
                <SectionRenderer key={section.id} section={section} config={config} />
              ))}
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
