import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/marketing/Navbar'
import { HeroSection } from '@/components/marketing/HeroSection'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { NotificationShowcase } from '@/components/marketing/NotificationShowcase'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { SocialNumbers } from '@/components/marketing/SocialNumbers'
import { PricingPreview } from '@/components/marketing/PricingPreview'
import { Footer } from '@/components/marketing/Footer'
import { ThemesShowcase } from '@/components/marketing/ThemesShowcase'
import { useLang } from '@/hooks/useLang'

const SITE_URL = 'https://7aba.store'

const TITLE = '7aba.store — أطلق متجرك الإلكتروني في الجزائر | دفعة واحدة'
const DESC =
  'منصة بناء المتاجر الإلكترونية للتجار الجزائريين. صمّم متجرك، انشره على Cloudflare Workers في دقيقتين، استقبل الطلبات مع إشعارات فورية. دفع نقدي وChargily Pay. ادفع مرة واحدة واكتسب كل شيء.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization entity — GEO: helps AI engines identify the brand
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: '7aba.store',
      alternateName: ['حبة ستور', 'Haba Store', '7aba store'],
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/logo/7aba_store_logo_i1.png`,
        width: 200,
        height: 60,
      },
      description:
        'منصة بناء المتاجر الإلكترونية للتجار الجزائريين. أنشئ متجرك على Cloudflare Workers بدفعة واحدة.',
      foundingDate: '2025',
      foundingLocation: { '@type': 'Country', name: 'Algeria' },
      areaServed: { '@type': 'Country', name: 'Algeria' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['Arabic', 'French'],
        contactOption: 'TollFree',
      },
      sameAs: [],
    },
    // WebSite entity — enables sitelinks search box in Google/AI
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: '7aba.store',
      description: DESC,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: ['ar', 'fr'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/demo?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    // SoftwareApplication — GEO: product entity for AI search
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#product`,
      name: '7aba.store',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'E-commerce Platform',
      operatingSystem: 'Web, iOS, Android',
      url: SITE_URL,
      description: DESC,
      offers: [
        {
          '@type': 'Offer',
          name: 'باقة مبتدئ',
          price: '3500',
          priceCurrency: 'DZD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'إنشاء ونشر المتاجر، نطاق مخصص، لوحة إدارة الطلبات',
        },
        {
          '@type': 'Offer',
          name: 'باقة احترافي',
          price: '20000',
          priceCurrency: 'DZD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'كل ما في مبتدئ + تحميل كود المتجر والتطبيق',
        },
        {
          '@type': 'Offer',
          name: 'باقة وكالة',
          price: '100000',
          priceCurrency: 'DZD',
          priceValidUntil: '2027-12-31',
          availability: 'https://schema.org/InStock',
          description: 'كل ما في احترافي + كود المنصة كاملاً',
        },
      ],
      featureList: [
        'نشر على Cloudflare Workers في دقيقتين',
        'دفع نقدي عند الاستلام',
        'دفع إلكتروني عبر Chargily Pay',
        'إشعارات الطلبات الفورية',
        'لوحة إدارة الطلبات',
        'نطاق مخصص مجاني',
        'ثلاثة قوالب احترافية',
        'دعم اللغة العربية والفرنسية',
        'مناطق الجزائر الـ 58',
      ],
      screenshot: `${SITE_URL}/demo-store-preview.png`,
      inLanguage: ['ar', 'fr'],
      audience: {
        '@type': 'Audience',
        audienceType: 'Algerian merchants and entrepreneurs',
        geographicArea: { '@type': 'Country', name: 'Algeria' },
      },
    },
    // HowTo schema — AEO: answers "how does 7aba.store work"
    {
      '@type': 'HowTo',
      name: 'كيف تنشئ متجرك الإلكتروني مع 7aba.store',
      description: 'أنشئ ونشر متجرك الإلكتروني في دقيقتين باستخدام منصة 7aba.store',
      totalTime: 'PT2M',
      tool: [{ '@type': 'HowToTool', name: 'Cloudflare Account' }, { '@type': 'HowToTool', name: 'InstantDB App' }],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'اختر قالبك', text: 'اختر من بين 3 قوالب: بسيط، جريء، دافئ' },
        { '@type': 'HowToStep', position: 2, name: 'خصص محتواك', text: 'أضف صور منتجاتك، الأسعار، الميزات والشهادات' },
        { '@type': 'HowToStep', position: 3, name: 'اختر طريقة الدفع', text: 'فعّل الدفع النقدي عند الاستلام أو Chargily Pay الإلكتروني' },
        { '@type': 'HowToStep', position: 4, name: 'انشر متجرك', text: 'انشر على Cloudflare Workers بنقرة واحدة وشارك رابط متجرك' },
      ],
    },
    // FAQPage — AEO: direct answers for Google/AI featured snippets
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'ما هي 7aba.store؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '7aba.store هي منصة جزائرية لبناء المتاجر الإلكترونية. تسمح للتجار بإنشاء ونشر متجر إلكتروني كامل على Cloudflare Workers في أقل من دقيقتين، مع دعم الدفع النقدي وChargily Pay، وإشعارات الطلبات الفورية.',
          },
        },
        {
          '@type': 'Question',
          name: 'كم يكلف إنشاء متجر إلكتروني في الجزائر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'مع 7aba.store تبدأ من 3,500 دج دفعة واحدة (لا اشتراك شهري). الباقات: مبتدئ 3,500 دج، احترافي 20,000 دج، وكالة 100,000 دج.',
          },
        },
        {
          '@type': 'Question',
          name: 'هل يدعم الموقع الدفع الإلكتروني في الجزائر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'نعم، 7aba.store يدعم Chargily Pay لقبول المدفوعات الإلكترونية داخل الجزائر، بالإضافة إلى الدفع نقداً عند الاستلام (COD).',
          },
        },
        {
          '@type': 'Question',
          name: 'هل أحتاج إلى خبرة تقنية لإنشاء متجر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'لا. منصة 7aba.store مصممة للتجار بدون خبرة تقنية. اختر قالبك، أضف منتجاتك، وانشر — كل ذلك في دقيقتين.',
          },
        },
        {
          '@type': 'Question',
          name: 'ما الفرق بين 7aba.store وShopify أو WooCommerce؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '7aba.store مصممة خصيصاً للسوق الجزائري: دفع بالدينار الجزائري، دفع نقدي عند الاستلام، ولايات الجزائر الـ58، Chargily Pay، واجهة عربية. ادفع مرة واحدة بدلاً من اشتراك شهري.',
          },
        },
        {
          '@type': 'Question',
          name: 'هل المتجر يعمل على الهاتف المحمول؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'نعم، جميع متاجر 7aba.store متجاوبة بالكامل مع الهواتف المحمولة وتُنشر على Cloudflare Workers للحصول على أسرع أداء ممكن.',
          },
        },
      ],
    },
  ],
}

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESC },
      // Open Graph
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESC },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:type', content: 'website' },
      // Twitter
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESC },
      // Canonical
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLd),
      },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  const { dir } = useLang()
  return (
    <div className="min-h-screen" dir={dir}>
      <Navbar />
      <HeroSection />
      <ComparisonTable />
      <HowItWorks />
      <NotificationShowcase />
      <FeatureGrid />
      <ThemesShowcase />
      <SocialNumbers />
      <PricingPreview />
      <Footer />
    </div>
  )
}
