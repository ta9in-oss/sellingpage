import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useLang } from '@/hooks/useLang'
import {
  ThemeProvider,
  HeroSection,
  SocialProofBar,
  FeatureGrid,
  BenefitsSection,
  ValueStackSection,
  TestimonialSection,
  CTASection,
  GuaranteeSection,
  OrderSection,
  FAQSection,
  brutalistTheme,
  type OrderData,
} from '@7aba/store-ui'

const SITE_URL = 'https://7aba.app'
const TITLE = 'متجر تجريبي | شوف كيف يبدو متجرك مع 7aba.store'
const DESC =
  'جرّب متجراً جزائرياً حقيقياً مبنياً بـ 7aba.store. شاهد كيف يبدو المتجر، اختبر نموذج الطلب، وتعرف على تجربة المشتري قبل أن تنشئ متجرك الخاص.'

const demoJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/demo#webpage`,
      url: `${SITE_URL}/demo`,
      name: TITLE,
      description: DESC,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'المتجر التجريبي', item: `${SITE_URL}/demo` },
        ],
      },
    },
    {
      '@type': 'ItemPage',
      name: 'متجر تجريبي - حقيبة ظهر احترافية',
      description: 'مثال حي لمتجر إلكتروني جزائري مبني بمنصة 7aba.store',
      image: `${SITE_URL}/demo-store-preview.png`,
    },
  ],
}

export const Route = createFileRoute('/demo')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESC },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESC },
      { property: 'og:url', content: `${SITE_URL}/demo` },
      { property: 'og:image', content: `${SITE_URL}/demo-store-preview.png` },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESC },
      { name: 'twitter:image', content: `${SITE_URL}/demo-store-preview.png` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/demo` }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify(demoJsonLd) }],
  }),
  component: DemoStorePage,
})

// ─── Demo content ────────────────────────────────────────────────────────────
const HERO = {
  title: ['حزام واحد', 'يحكم الكل'],
  description: 'صاكادو يد وحدة: يرفد بزاف ويبان صغير. خفيف، مريح، يخدم القراية والسبور والخرجات',
  ctaText: 'اشتر الآن',
  ctaLink: '#buy',
  image: '/bagpack_001.png',
  priceTag: { amount: '2500', currency: 'دج' },
  freeDelivery: true,
}

const FEATURES = [
  { image: 'bagpack_005.png', title: 'السعة', description: 'هي جاية كي شغل F1 فيها جيب واحد كبير تحط فيه كلش. يرفد الله يبارك، كراس، حاسوب، ملابس، كل شي.', bgColor: 'bg-yellow-400 text-black' },
  { image: 'bagpack_003.png', title: 'مريح للظهر', description: 'التصميم مدروس باش يكون مريح للظهر ولكتف. ما تحسش بالثقل حتى لو رفدتها طول النهار.', bgColor: 'bg-black text-white' },
  { image: 'bagpack_004.png', title: 'متين وعصري', description: 'مصنوع من مواد متينة تتحمل الاستخدام اليومي. تصميم عصري يناسب كل المناسبات.', bgColor: 'bg-white text-black' },
]

const PRODUCT_IMAGES = [
  { id: 1, image: 'bagpack_002.png', title: 'حقيبة ظهر بذراع واحدة', bgColor: 'bg-black text-white' },
  { id: 2, image: 'bagpack_003.png', title: 'تصميم عصري', bgColor: 'bg-yellow-400 text-black' },
  { id: 3, image: 'bagpack_004.png', title: 'مريحة ومتينة', bgColor: 'bg-white text-black' },
]

const BENEFITS = [
  { icon: 'check', title: 'مريح للظهر', description: 'التصميم مدروس باش يكون مريح للظهر ولكتف. ما تحسش بالثقل حتى لو رفدتها طول النهار.' },
  { icon: 'check', title: 'خفيف للغاية', description: 'وزن خفيف ما يحسسكش بالثقل حتى لو رفدت فيه بزاف حاجات.' },
  { icon: 'check', title: 'تصميم عصري', description: 'تصميم أنيق يناسب الجامعة، السبور، والخرجات.' },
]

const TESTIMONIALS = [
  { id: 1, name: 'أحمد بن علي', location: 'الجزائر العاصمة', comment: 'الصاكادو روعة! خفيف و يرفد بزاف. استعملتها في رحلة للجامعة و كانت ممتازة', rating: 5 },
  { id: 2, name: 'فاطمة كريم', location: 'وهران', comment: 'شريتها لولدي وهو فرحان بيها. جودة عالية وسعر مناسب. نوصي بيها للكل', rating: 5 },
  { id: 3, name: 'يوسف مختار', location: 'قسنطينة', comment: 'صاكادو رائعة! خفيفة ومريحة جداً. استخدمتها في السفر والرياضة وكانت مثالية', rating: 4 },
]

const FAQS = [
  { id: 1, question: 'كيفاش نطلب الصاكادو؟', answer: 'فقط فيل الاستمارة بالمعلومات ديالك. راح يتصل بيك الفريق باش يأكد الطلب.' },
  { id: 2, question: 'كم تاخذ التوصيل؟', answer: 'من 2 لـ 5 أيام عمل على حسب ولايتك.' },
  { id: 3, question: 'واش التوصيل مجاني؟', answer: 'نعم! التوصيل مجاني لكامل التراب الوطني.' },
]

const GUARANTEES = [
  { icon: 'truck', title: 'توصيل مجاني', description: 'التوصيل باطل لكامل التراب الوطني' },
  { icon: 'shield', title: 'ضمان 7 أيام', description: 'إرجاع مجاني لمدة 7 أيام إذا ما عجبكش' },
  { icon: 'check', title: 'دفع عند الاستلام', description: 'تخلص غير لما يوصلك الطلب' },
]

const CTA = {
  title: 'ماتخليهاش تفوتك!',
  subtitle: 'اطلب الصاكادو ديالك دك',
  description: 'العرض محدود. اطلب اليوم واستفد من التوصيل المجاني والدفع عند الاستلام',
  buttonText: 'نعم، نبغي نشري دك!',
  urgencyText: 'متبقي فقط كمية محدودة',
  features: ['توصيل مجاني', 'دفع عند الاستلام', 'إرجاع مجاني لمدة 7 أيام'],
}

const ORDER_LAYOUT = {
  type: 'form-right-carousel-quantity-left' as const,
  showCarousel: true,
  carouselPosition: 'top-left' as const,
}

function DemoBanner() {
  return (
    <div className="bg-yellow-400 border-b-4 border-black py-2 px-4 text-center font-black text-sm text-black">
      🎯 هذا متجر تجريبي. هذا هو شكل متجرك مع حبة ستور |{' '}
      <a href="/pricing" className="underline hover:no-underline">
        ابدأ الآن
      </a>
    </div>
  )
}

function DemoStorePage() {
  const { dir } = useLang()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const scrollToBuy = () => {
    document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDemoOrder = async (_orderData: OrderData) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <ThemeProvider value={brutalistTheme}>
      <div dir={dir} className="font-['Almarai',_sans-serif]">
        <DemoBanner />
        <HeroSection content={HERO} onCtaClick={scrollToBuy} />
        <SocialProofBar rating={4.9} reviewCount={318} />
        <FeatureGrid title="مميزات الصاكادو" features={FEATURES} />
        <BenefitsSection benefits={BENEFITS} />
        <ValueStackSection price={2500} onCtaClick={scrollToBuy} />
        <TestimonialSection testimonials={TESTIMONIALS} />
        <CTASection cta={CTA} />
        <GuaranteeSection guarantees={GUARANTEES} />
        <div id="buy">
          {submitted ? (
            <div className="max-w-xl mx-auto my-16 p-8 border-4 border-black bg-green-400 text-center font-black text-xl">
              ✅ تم استلام طلبك التجريبي! في المتجر الحقيقي راح يتصل بيك الفريق.
            </div>
          ) : (
            <OrderSection
              price={2500}
              totalStock={50}
              productImages={PRODUCT_IMAGES}
              onSubmit={handleDemoOrder}
              isSubmitting={isSubmitting}
              layoutConfig={ORDER_LAYOUT}
              title="اطلب الآن"
              activePaymentMethod="cod"
            />
          )}
        </div>
        <FAQSection faqs={FAQS} />
        <div className="bg-black text-white py-12 px-6 text-center border-t-4 border-yellow-400">
          <h2 className="text-2xl font-black mb-4">أعجبك الشكل؟ اصنع متجرك الآن 🚀</h2>
          <p className="text-gray-400 mb-6">متجرك جاهز في 5 دقايق. بدون كود، بدون تقنية</p>
          <a
            href="/pricing"
            className="inline-block bg-yellow-400 text-black px-8 py-4 border-4 border-yellow-400 font-black text-lg hover:bg-yellow-300 transition-colors"
          >
            ابدأ الآن: 3,500 دج دفعة واحدة
          </a>
        </div>
      </div>
    </ThemeProvider>
  )
}
