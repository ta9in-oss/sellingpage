import '@/styles/landing.css'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useLang } from '@/hooks/useLang'
import { trackPixel } from '@/lib/pixel'
import { getStarterPriceVariant } from '@/lib/starterPriceVariant'
import { Nav } from '@/components/marketing/landing/Nav'
import { Hero } from '@/components/marketing/landing/Hero'
import { Manifesto } from '@/components/marketing/landing/Manifesto'
import { Features } from '@/components/marketing/landing/Features'
import { Proof } from '@/components/marketing/landing/Proof'
import { How } from '@/components/marketing/landing/How'
import { Pricing } from '@/components/marketing/landing/Pricing'
import { Roadmap } from '@/components/marketing/landing/Roadmap'
import { FinalCta } from '@/components/marketing/landing/FinalCta'
import { Footer } from '@/components/marketing/landing/Footer'

const SITE_URL = 'https://7aba.app'

const TITLE = '7aba.app | أطلق متجرك الإلكتروني في الجزائر | دفعة واحدة'
const DESC =
  'منصة بناء المتاجر الإلكترونية للتجار الجزائريين. صمّم متجرك، انشره على Cloudflare Workers في دقيقتين، استقبل الطلبات مع إشعارات فورية. دفع نقدي وChargily Pay. ادفع مرة واحدة واكتسب كل شيء.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization entity — GEO: helps AI engines identify the brand
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: '7aba.app',
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
      name: '7aba.app',
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
      name: '7aba.app',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'E-commerce Platform',
      operatingSystem: 'Web, iOS, Android',
      url: SITE_URL,
      description: DESC,
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter',
          price: '2000',
          priceCurrency: 'DZD',
          priceValidUntil: '2026-08-15',
          availability: 'https://schema.org/InStock',
          description: 'بع بنفسك: إنشاء ونشر المتاجر، نطاق مخصص، لوحة إدارة الطلبات',
        },
        {
          '@type': 'Offer',
          name: 'Freelancer',
          price: '7000',
          priceCurrency: 'DZD',
          priceValidUntil: '2026-08-15',
          availability: 'https://schema.org/InStock',
          description: 'كل ما في Starter + تحميل كود المتجر + دعم أولوي',
        },
        {
          '@type': 'Offer',
          name: 'Run One',
          price: '100000',
          priceCurrency: 'DZD',
          priceValidUntil: '2026-08-15',
          availability: 'https://schema.org/InStock',
          description: 'كل ما في Freelancer + إعداد المنصة كاملاً + أول التحديثات + متاجر عملاء غير محدودة',
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
    // HowTo schema — AEO: answers "how does 7aba.app work"
    {
      '@type': 'HowTo',
      name: 'كيف تنشئ متجرك الإلكتروني مع 7aba.app',
      description: 'أنشئ ونشر متجرك الإلكتروني في دقيقتين باستخدام منصة 7aba.app',
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
          name: 'ما هي 7aba.app؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '7aba.app هي منصة جزائرية لبناء المتاجر الإلكترونية. تسمح للتجار بإنشاء ونشر متجر إلكتروني كامل على Cloudflare Workers في أقل من دقيقتين، مع دعم الدفع النقدي وChargily Pay، وإشعارات الطلبات الفورية.',
          },
        },
        {
          '@type': 'Question',
          name: 'كم يكلف إنشاء متجر إلكتروني في الجزائر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'مع 7aba تبدأ من 1,000 دج دفعة واحدة (لا اشتراك شهري) خلال الدفعة الأولى حتى 15 أوت 2026. الباقات: Starter من 1,000 دج، Freelancer 7,000 دج، Run One 100,000 دج. أسعار الدفعة الأولى لأول 100 مشترك في Starter، 10 في Freelancer، 3 في Run One.',
          },
        },
        {
          '@type': 'Question',
          name: 'هل يدعم الموقع الدفع الإلكتروني في الجزائر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'نعم، 7aba.app يدعم Chargily Pay لقبول المدفوعات الإلكترونية داخل الجزائر، بالإضافة إلى الدفع نقداً عند الاستلام (COD).',
          },
        },
        {
          '@type': 'Question',
          name: 'هل أحتاج إلى خبرة تقنية لإنشاء متجر؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'لا. منصة 7aba.app مصممة للتجار بدون خبرة تقنية. اختر قالبك، أضف منتجاتك، وانشر. كل ذلك في دقيقتين.',
          },
        },
        {
          '@type': 'Question',
          name: 'ما الفرق بين 7aba.app وShopify أو WooCommerce؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '7aba.app مصممة خصيصاً للسوق الجزائري: دفع بالدينار الجزائري، دفع نقدي عند الاستلام، ولايات الجزائر الـ58، Chargily Pay، واجهة عربية. ادفع مرة واحدة بدلاً من اشتراك شهري.',
          },
        },
        {
          '@type': 'Question',
          name: 'هل المتجر يعمل على الهاتف المحمول؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'نعم، جميع متاجر 7aba.app متجاوبة بالكامل مع الهواتف المحمولة وتُنشر على Cloudflare Workers للحصول على أسرع أداء ممكن.',
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
    links: [
      { rel: 'canonical', href: SITE_URL },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800;900&family=Archivo:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;900&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Rubik:wght@400;500;600;700;800;900&display=swap',
      },
    ],
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

  useEffect(() => {
    // Meta flagged 100% of ViewContent on 7aba.app as missing value/currency —
    // that was Meta's own automatic/heuristic event detection on this page,
    // since no code here ever called trackPixel before. This explicit call
    // with real params both fixes the diagnostic and gives Meta a usable
    // signal for ROAS optimization.
    trackPixel('ViewContent', { value: getStarterPriceVariant(), currency: 'DZD', content_name: 'landing' })
  }, [])

  return (
    <div className="landing-root" dir={dir}>
      <Nav /><Hero /><Manifesto /><Features /><Proof /><How /><Pricing /><Roadmap /><FinalCta /><Footer />
    </div>
  )
}
