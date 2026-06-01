import { createFileRoute } from '@tanstack/react-router'
import {
  ThemeProvider,
  HeroSection,
  SocialProofBar,
  FeatureGrid,
  BenefitsSection,
  TestimonialSection,
  CTASection,
  GuaranteeSection,
  FAQSection,
  FooterSection,
  brutalistTheme,
  ComparisonSection,
} from '@7aba/store-ui'
import { Navbar } from '@/components/marketing/Navbar'
import { useLang } from '@/hooks/useLang'

const SITE_URL = 'https://7aba.app'

const TITLE = '7aba.store | أطلق متجرك الإلكتروني في الجزائر | دفعة واحدة'
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
            text: 'لا. منصة 7aba.store مصممة للتجار بدون خبرة تقنية. اختر قالبك، أضف منتجاتك، وانشر. كل ذلك في دقيقتين.',
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
    <div dir={dir}>
      <Navbar />
      <ThemeProvider value={brutalistTheme}>
        {/* Hero */}
        <HeroSection
          content={{
            title: ['ابني متجرك', 'في دقيقتين'],
            description: 'منصة جزائرية لإنشاء المتاجر الإلكترونية. صمّم، خصّص، وانشر على Cloudflare بدفعة واحدة. بدون اشتراك شهري.',
            ctaText: 'ابدأ الآن',
            ctaLink: '/dashboard',
            image: '/demo-store-preview.png',
            priceTag: { amount: 'من 3,500', currency: 'دج' },
            freeDelivery: false,
          }}
          onCtaClick={() => { window.location.href = '/dashboard' }}
        />

        {/* Social proof */}
        <SocialProofBar reviewCount={500} rating={4.9} />

        {/* Features */}
        <FeatureGrid
          title="لماذا 7aba.store؟"
          subtitle="كل ما يحتاجه تاجر جزائري في مكان واحد"
          features={[
            { image: '', title: 'نشر تلقائي', description: 'انشر متجرك على Cloudflare Workers في ثوانٍ. أسرع CDN في العالم بدون سيرفر خاص', bgColor: 'bg-yellow-50' },
            { image: '', title: 'Chargily Pay مدمج', description: 'استقبل الدفع الإلكتروني بالدينار الجزائري مباشرة. بدون إعداد معقد', bgColor: 'bg-white' },
            { image: '', title: '3 قوالب احترافية', description: 'اختر من بين قوالب مُصممة لرفع معدل التحويل: Brutalist، Clean، وDark Pro', bgColor: 'bg-gray-50' },
            { image: '', title: 'إشعارات FOMO', description: 'أشعل الرغبة عند زوار متجرك بإشعارات الطلبات الفورية. تزيد المبيعات بنسبة 30٪', bgColor: 'bg-yellow-50' },
            { image: '', title: 'لوحة إدارة متكاملة', description: 'تابع طلباتك، حالة التوصيل، والإيرادات من لوحة تحكم عربية سهلة الاستخدام', bgColor: 'bg-white' },
            { image: '', title: '58 ولاية جزائرية', description: 'قاعدة بيانات كاملة لكل ولايات الجزائر ومدنها. توصيل لا أخطاء فيه', bgColor: 'bg-gray-50' },
          ]}
        />

        {/* Benefits */}
        <BenefitsSection
          title="ما يميّزنا عن البقية"
          subtitle="بنيناها بأيدينا للسوق الجزائري"
          benefits={[
            { icon: '🚀', title: 'بدون خبرة تقنية', description: 'من الصفر إلى متجر حيّ في أقل من دقيقتين. لا تحتاج لمبرمج.' },
            { icon: '💳', title: 'دفعة واحدة للأبد', description: 'لا اشتراك شهري، لا مفاجآت. ادفع مرة وامتلك متجرك إلى الأبد.' },
            { icon: '⚡', title: 'سرعة Edge Computing', description: 'متجرك يُخدَّم من Cloudflare. أسرع تحميل = أقل ارتداد = أكثر مبيعات.' },
            { icon: '🇩🇿', title: 'صُنع في الجزائر', description: 'منصة فهمت السوق المحلي: الدينار، COD، شاريلي، ولايات الجزائر الـ58.' },
            { icon: '📦', title: 'كود المصدر لك', description: 'في الباقات المتقدمة تحصل على كود المتجر والمنصة كاملاً. ملكيتك 100٪.' },
            { icon: '🛠️', title: 'دعم وتطوير مستمر', description: 'تحديثات منتظمة وميزات جديدة باستمرار. مجتمع تجار جزائريين نشط.' },
          ]}
        />

        {/* Testimonials */}
        <TestimonialSection
          title="ماذا قال التجار؟"
          testimonials={[
            { id: 1, name: 'محمد من الجزائر العاصمة', location: 'تاجر إلكترونيات', rating: 5, comment: 'فتحت متجري في أقل من دقيقتين. شاريلي يعمل من الأول، الطلبات تجي وأنا نايم.' },
            { id: 2, name: 'ريم من وهران', location: 'متجر عطور', rating: 5, comment: 'كنت خايفة من الجانب التقني. لقيت 7aba.store وكل شي بسيط جداً. الآن عندي متجر احترافي.' },
            { id: 3, name: 'خالد من قسنطينة', location: 'أكسسوارات هاتف', rating: 5, comment: 'دفعت مرة واحدة وخلصت. لا اشتراك شهري يوجعني. أفضل استثمار في مسيرتي التجارية.' },
          ]}
        />

        {/* Comparison */}
        <ComparisonSection title="كيف نقارن بالآخرين؟" />

        {/* CTA */}
        <CTASection
          cta={{
            title: 'متجرك على بُعد نقرة',
            subtitle: 'ابدأ اليوم. الأسعار ترتفع قريباً',
            description: 'انضم لمئات التجار الجزائريين الذين يبيعون عبر 7aba.store.',
            buttonText: 'أنشئ متجرك الآن',
            urgencyText: 'عرض محدود. أسعار التأسيس لن تدوم',
            features: ['دفعة واحدة للأبد', 'نشر في دقيقتين', 'دعم مستمر'],
          }}
        />

        {/* Guarantees */}
        <GuaranteeSection
          title="ضماناتنا لك"
          guarantees={[
            { icon: '🛡️', title: 'ضمان الاسترداد', description: 'إذا لم تتمكن من نشر متجرك في 24 ساعة بسبب مشكلة منا، نستردّ لك المبلغ كاملاً.' },
            { icon: '🔒', title: 'بياناتك آمنة', description: 'بيانات متجرك ومستخدميك مشفرة ومحمية. لا نشارك أي معلومات مع أطراف ثالثة.' },
            { icon: '♾️', title: 'مدى الحياة', description: 'لا تنتهي صلاحيتك أبداً. المنصة ملكك بعد أول دفعة، للأبد.' },
          ]}
        />

        {/* FAQ */}
        <FAQSection
          title="أسئلة شائعة"
          faqs={[
            { id: 1, question: 'هل أحتاج خبرة تقنية؟', answer: 'لا على الإطلاق. المنصة مصممة لأي شخص. اتبع الخطوات وستنشر متجرك في أقل من دقيقتين.' },
            { id: 2, question: 'كيف يعمل الدفع الإلكتروني؟', answer: 'نستخدم Chargily Pay، بوابة الدفع الجزائرية. ستحتاج لحساب Chargily مجاني وربطه بمتجرك من لوحة التحكم.' },
            { id: 3, question: 'هل يمكنني تغيير تصميم المتجر؟', answer: 'نعم. لديك builder بصري كامل لتغيير الألوان، الخطوط، الصور، والمحتوى. الأقسام قابلة للنقل والتخصيص.' },
            { id: 4, question: 'ماذا يحدث بعد الدفع؟', answer: 'تُفتح لك لوحة التحكم فوراً. أنشئ متجرك، صممه، وانشره على Cloudflare بنقرة واحدة.' },
            { id: 5, question: 'هل يمكنني استخدام نطاق خاص؟', answer: 'نعم. بعد النشر يمكنك ربط أي نطاق تملكه بمتجرك من إعدادات Cloudflare.' },
            { id: 6, question: 'ما الفرق بين الباقات؟', answer: 'Starter: إنشاء المتاجر والنشر. Pro: + تحميل كود المتجر والتطبيق. Agency: + كود المنصة الكاملة.' },
          ]}
        />

        {/* Footer */}
        <FooterSection
          content={{
            storeName: '7aba.store',
            tagline: 'منصة المتاجر الإلكترونية للتجار الجزائريين',
            links: [
              { label: 'الأسعار', href: '/pricing' },
              { label: 'المتجر التجريبي', href: '/demo' },
              { label: 'لوحة التحكم', href: '/dashboard' },
            ],
            copyright: `© ${new Date().getFullYear()} 7aba.store. جميع الحقوق محفوظة`,
          }}
        />
      </ThemeProvider>
    </div>
  )
}
