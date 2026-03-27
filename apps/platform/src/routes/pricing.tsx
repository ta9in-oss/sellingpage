import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { Footer } from '@/components/marketing/Footer'
import { Navbar } from '@/components/marketing/Navbar'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

const TITLE = 'الأسعار — 7aba.store'
const DESC = 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت. ابنِ متجرك الإلكتروني الجزائري بسعر يبدأ من 3,900 دج.'

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESC },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESC },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESC },
    ],
  }),
  component: PricingPage,
})

const T = {
  hero: { ar: 'الأسعار', fr: 'Tarifs' },
  sub: { ar: 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت.', fr: "Payez une fois. Pas d'abonnements." },
  once: { ar: 'دفعة واحدة', fr: 'Paiement unique' },
  cta: { ar: 'ابدأ الآن', fr: 'Commencer' },
  faq: { ar: 'الأسئلة الشائعة', fr: 'FAQ' },
  back: { ar: 'العودة للرئيسية', fr: 'Retour à l\'accueil' },
}

const TIERS = [
  {
    id: 'starter' as const,
    name: { ar: 'مبتدئ', fr: 'Starter' },
    price: '3,900',
    usd: '$29',
    accent: false,
    badge: null,
    features: {
      ar: ['إنشاء ونشر المتاجر', 'نطاق مخصص عبر Cloudflare', 'لوحة إدارة الطلبات', 'دفع نقدي + Chargily', 'تحليلات Google Analytics'],
      fr: ['Créer et publier des boutiques', 'Domaine personnalisé Cloudflare', 'Tableau de bord commandes', 'Paiement cash + Chargily', 'Analytics Google'],
    },
  },
  {
    id: 'pro' as const,
    name: { ar: 'احترافي', fr: 'Pro' },
    price: '14,900',
    usd: '$99',
    accent: true,
    badge: { ar: 'الأكثر شيوعاً', fr: 'Populaire' },
    features: {
      ar: ['كل مزايا مبتدئ', 'تحميل كود المتجر (React)', 'تحميل كود التطبيق المحمول', 'دعم ذو أولوية'],
      fr: ['Tout Starter', 'Télécharger code boutique (React)', 'Télécharger code app mobile', 'Support prioritaire'],
    },
  },
  {
    id: 'agency' as const,
    name: { ar: 'وكالة', fr: 'Agence' },
    price: '49,000',
    usd: '$299',
    accent: false,
    badge: null,
    features: {
      ar: ['كل مزايا احترافي', 'كود المنصة كاملاً', 'متاجر غير محدودة', 'دعم مباشر عبر واتساب'],
      fr: ['Tout Pro', 'Code plateforme complet', 'Boutiques illimitées', 'Support WhatsApp direct'],
    },
  },
]

const FAQS = [
  {
    q: { ar: 'هل الدفع مرة واحدة فعلاً؟', fr: 'Le paiement est-il vraiment unique?' },
    a: { ar: 'نعم، تدفع مرة واحدة وتستخدم إلى الأبد. لا اشتراك شهري، لا مفاجآت.', fr: 'Oui, vous payez une fois et utilisez pour toujours.' },
  },
  {
    q: { ar: 'هل يمكنني الترقية لاحقاً؟', fr: 'Puis-je passer à un niveau supérieur?' },
    a: { ar: 'نعم، يمكنك الترقية في أي وقت وتدفع الفرق فقط.', fr: 'Oui, vous pouvez passer à un niveau supérieur et ne payer que la différence.' },
  },
  {
    q: { ar: 'ما طرق الدفع المتاحة؟', fr: 'Quels modes de paiement sont disponibles?' },
    a: { ar: 'ندعم Chargily Pay (بطاقة CIB، Dahabia) وسيتم إضافة طرق أخرى قريباً.', fr: 'Nous supportons Chargily Pay (CIB, Dahabia).' },
  },
  {
    q: { ar: 'ماذا أحتاج لنشر متجري؟', fr: "De quoi ai-je besoin pour déployer ma boutique?" },
    a: { ar: 'تحتاج حساب Cloudflare مجاني وحساب InstantDB مجاني — كلاهما سنساعدك بإعدادهم داخل المنصة.', fr: 'Vous avez besoin d\'un compte Cloudflare gratuit et d\'un compte InstantDB gratuit.' },
  },
]

function PricingPage() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4 text-center border-b-2 border-black">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black text-black mb-4">{t(T.hero)}</h1>
          <p className="text-xl text-black/60">{t(T.sub)}</p>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col p-8 border-2 border-black',
                tier.accent
                  ? 'bg-yellow-400 shadow-[6px_6px_0px_0px_#000]'
                  : 'bg-white shadow-[4px_4px_0px_0px_#000]',
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-yellow-400 text-xs font-bold px-3 py-1 whitespace-nowrap">
                  {t(tier.badge)}
                </span>
              )}

              <h2 className="text-xl font-black text-black mb-1">{t(tier.name)}</h2>
              <div className="mb-6">
                <span className="text-4xl font-black text-black">{tier.price}</span>
                <span className="text-sm text-black/60 ms-1">DZD</span>
                <div className="text-xs text-black/50 mt-0.5">{tier.usd} · {t(T.once)}</div>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {(lang === 'ar' ? tier.features.ar : tier.features.fr).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-black">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-black" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard"
                search={{ plan: tier.id } as any}
                className={cn(
                  'text-center font-black py-3 border-2 border-black text-sm transition-all',
                  tier.accent
                    ? 'bg-black text-yellow-400 hover:bg-zinc-900'
                    : 'bg-yellow-400 text-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] shadow-[3px_3px_0px_0px_#000]',
                )}
              >
                {t(T.cta)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <ComparisonTable />

      {/* FAQ */}
      <section className="py-16 px-4 bg-white border-y-2 border-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-black text-center mb-10">{t(T.faq)}</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="border-2 border-black p-5 group cursor-pointer select-none"
              >
                <summary className="font-bold text-black list-none flex justify-between items-center">
                  {t(faq.q)}
                  <ArrowLeft className="h-4 w-4 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-black/70 leading-relaxed">{t(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
