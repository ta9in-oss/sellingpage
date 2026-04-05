import { useEffect, useRef, useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { loadGoogleFont } from '@/lib/googleFonts'
import {
  ThemeProvider,
  HeroSection,
  FAQSection,
  GuaranteeSection,
  TestimonialSection,
  FeatureGrid,
  OrderSection,
  SocialProofBar,
  CTASection,
  BenefitsSection,
  ValueStackSection,
  ProductCarousel,
  FooterSection,
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
import { cn } from '@/lib/utils'
import { ZoomIn, ZoomOut } from 'lucide-react'

type Zoom = 40 | 55 | 75 | 100

const ZOOM_STEPS: Zoom[] = [40, 55, 75, 100]

// Placeholder product images
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
        description: section.subheadline || 'صف منتجك في سطر أو سطرين.',
        ctaText: section.cta || 'اطلب الآن',
        ctaLink: '#buy',
        image: section.image || '/bagpack_001.png',
        priceTag: {
          amount: config.product.price > 0 ? String(config.product.price) : '2500',
          currency: config.product.currency || 'دج',
        },
        freeDelivery: section.freeDelivery ?? true,
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
      return <FeatureGrid title={section.title || 'المميزات'} features={features} />
    }

    case 'testimonials': {
      const testimonials: Testimonial[] = section.items.length > 0
        ? section.items.map((item, i) => ({
            id: i + 1,
            name: item.name,
            rating: item.rating,
            comment: item.text,
            location: item.location,
          }))
        : [
            { id: 1, name: 'أحمد بن علي', location: 'الجزائر', comment: 'منتج رائع! جودة ممتازة وتوصيل سريع', rating: 5 },
            { id: 2, name: 'فاطمة الزهراء', location: 'وهران', comment: 'راضية بزاف على الشراء، ننصح بيه', rating: 5 },
          ]
      return <TestimonialSection testimonials={testimonials} title={section.title} />
    }

    case 'faq': {
      const faqs: FAQItem[] = section.items.length > 0
        ? section.items.map((item, i) => ({ id: i + 1, question: item.q, answer: item.a }))
        : [
            { id: 1, question: 'كيفاش نطلب؟', answer: 'اكتب معلوماتك في الاستمارة.' },
            { id: 2, question: 'واش التوصيل مجاني؟', answer: 'إيه! لكامل الوطن.' },
          ]
      return <FAQSection faqs={faqs} title={section.title} />
    }

    case 'guarantee': {
      const guarantees: Guarantee[] = section.items && section.items.length > 0
        ? section.items.map((item) => ({ icon: item.icon, title: item.title, description: item.description }))
        : [
            { icon: 'truck', title: 'توصيل مجاني', description: 'لجميع الولايات' },
            { icon: 'refresh', title: 'إرجاع مجاني', description: 'خلال 7 أيام' },
            { icon: 'shield', title: 'ضمان الجودة', description: 'استرداد الأموال' },
          ]
      return <GuaranteeSection guarantees={guarantees} title={section.title} />
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
          title={section.title || section.submitLabel || 'اطلب الآن'}
        />
      )
    }

    case 'social-proof': {
      return <SocialProofBar reviewCount={section.reviewCount ?? 300} rating={section.rating ?? 4.9} />
    }

    case 'cta': {
      return (
        <CTASection
          cta={{
            title: section.headline || 'اطلب الآن وادفع عند الاستلام',
            subtitle: section.subheadline || 'توصيل مجاني لجميع الولايات',
            buttonText: section.cta || 'اطلب الآن',
            urgent: true,
          }}
        />
      )
    }

    case 'benefits': {
      const benefits = (section.items ?? []).length > 0
        ? section.items
        : [
            { icon: '🚀', title: 'توصيل سريع', description: 'خلال 48-72 ساعة' },
            { icon: '💯', title: 'ضمان الجودة', description: '7 أيام استرداد' },
            { icon: '🔒', title: 'أمان الدفع', description: 'دفع عند الاستلام' },
          ]
      return <BenefitsSection benefits={benefits} title={section.title} />
    }

    case 'value-stack': {
      return (
        <ValueStackSection
          price={config.product.price ?? 2990}
          items={section.items}
          ctaText={section.ctaText}
        />
      )
    }

    case 'product-carousel': {
      const images: ProductImage[] = (config.product.images ?? []).length > 0
        ? config.product.images.map((img: any, i: number) => ({
            id: i + 1,
            image: img.src ?? img,
            title: img.alt ?? config.product.name ?? 'صورة المنتج',
            bgColor: img.bgColor ?? 'bg-gray-100',
          }))
        : PLACEHOLDER_IMAGES
      return <ProductCarousel products={images} />
    }

    case 'footer': {
      return (
        <FooterSection
          content={{
            storeName: section.storeName ?? config.meta.siteTitle ?? 'متجري',
            tagline: section.tagline,
            phone: section.phone,
            email: section.email,
            whatsapp: section.whatsapp,
            copyright: section.copyright,
          }}
        />
      )
    }

    default:
      return null
  }
}

export function StorePreview() {
  const { config, selectedSectionId, selectSection } = useBuilderStore()
  const [zoom, setZoom] = useState<Zoom>(55)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })

  // Load theme fonts
  useEffect(() => {
    loadGoogleFont(config.theme.typography.fontFamily)
    if (config.theme.typography.headingFont) {
      loadGoogleFont(config.theme.typography.headingFont)
    }
  }, [config.theme.typography.fontFamily, config.theme.typography.headingFont])

  // Spacebar pan tool
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpaceHeld(false)
        setIsPanning(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!spaceHeld || !scrollRef.current) return
    e.preventDefault()
    setIsPanning(true)
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollRef.current.scrollLeft,
      scrollTop: scrollRef.current.scrollTop,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !scrollRef.current) return
    const dx = e.clientX - panStart.current.x
    const dy = e.clientY - panStart.current.y
    scrollRef.current.scrollLeft = panStart.current.scrollLeft - dx
    scrollRef.current.scrollTop = panStart.current.scrollTop - dy
  }

  const handleMouseUp = () => setIsPanning(false)

  const zoomIndex = ZOOM_STEPS.indexOf(zoom)
  const canZoomIn = zoomIndex < ZOOM_STEPS.length - 1
  const canZoomOut = zoomIndex > 0
  const scale = zoom / 100

  return (
    // dir="ltr" isolates this component from RTL context — preview is always centered
    <div className="flex flex-col h-full bg-zinc-100" dir="ltr">
      {/* Zoom toolbar */}
      <div className="flex items-center justify-center gap-2 py-1.5 bg-zinc-200 border-b border-zinc-300 shrink-0">
        <button
          onClick={() => setZoom(ZOOM_STEPS[zoomIndex - 1])}
          disabled={!canZoomOut}
          className="p-1 rounded hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs font-mono text-zinc-600 w-10 text-center">{zoom}%</span>
        <button
          onClick={() => setZoom(ZOOM_STEPS[zoomIndex + 1])}
          disabled={!canZoomIn}
          className="p-1 rounded hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        {spaceHeld && (
          <span className="text-xs text-zinc-500 ms-2 font-mono">
            {isPanning ? '✋ panning' : '🤚 pan mode'}
          </span>
        )}
      </div>

      {/* Scrollable preview area */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-auto flex justify-center p-4',
          spaceHeld && !isPanning && 'cursor-grab',
          isPanning && 'cursor-grabbing select-none',
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Outer wrapper sizes to scaled width so the scroll container knows the content width */}
        <div
          style={{
            width: `${1200 * scale}px`,
            minHeight: '100%',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '1200px',
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            <div
              className="border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white"
              style={{ fontFamily: config.theme.typography.fontFamily }}
              dir={config.meta.rtl ? 'rtl' : 'ltr'}
            >
              <ThemeProvider value={config.theme}>
                {config.sections.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-zinc-400 text-lg">
                    {config.meta.rtl
                      ? 'لا توجد أقسام — أضف قسمًا من القائمة'
                      : 'No sections — add one from the sidebar'}
                  </div>
                ) : (
                  config.sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => !spaceHeld && selectSection(section.id)}
                      className={cn(
                        'relative transition-all',
                        !spaceHeld && 'cursor-pointer',
                        selectedSectionId === section.id
                          ? 'ring-4 ring-inset ring-yellow-400'
                          : !spaceHeld && 'hover:ring-2 hover:ring-inset hover:ring-zinc-300'
                      )}
                      title={section.type}
                    >
                      <SectionRenderer section={section} config={config} />
                      {selectedSectionId === section.id && (
                        <div className="absolute top-0 start-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 z-10">
                          {section.type}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
