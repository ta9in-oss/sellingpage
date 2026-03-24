import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { Check, X, Zap } from 'lucide-react'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

// ─── Tier definitions ─────────────────────────────────────────────────────────

type Tier = 'starter' | 'pro' | 'agency'

const TIERS: {
  id: Tier
  name: { ar: string; fr: string }
  price: { dzd: string; usd: string }
  badge: { ar: string; fr: string } | null
  accent: boolean
  features: Array<{
    text: { ar: string; fr: string }
    included: boolean
    highlight?: boolean
  }>
}[] = [
  {
    id: 'starter',
    name: { ar: 'مبتدئ', fr: 'Starter' },
    price: { dzd: '3,900', usd: '$29' },
    badge: null,
    accent: false,
    features: [
      { text: { ar: 'إنشاء ونشر المتاجر', fr: 'Créer & déployer des boutiques' }, included: true },
      { text: { ar: 'نطاق مخصص عبر Cloudflare', fr: 'Domaine personnalisé (Cloudflare)' }, included: true },
      { text: { ar: 'لوحة إدارة الطلبات', fr: 'Tableau de bord des commandes' }, included: true },
      { text: { ar: 'دعم الدفع نقداً وChargily', fr: 'COD + paiement Chargily' }, included: true },
      { text: { ar: 'دعم عبر البريد', fr: 'Support par e-mail' }, included: true },
      { text: { ar: 'تحميل كود المتجر', fr: 'Télécharger le code boutique' }, included: false },
      { text: { ar: 'تحميل كود التطبيق', fr: 'Télécharger le code app' }, included: false },
      { text: { ar: 'كود المنصة كاملاً', fr: 'Code source plateforme' }, included: false },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', fr: 'Pro' },
    price: { dzd: '14,900', usd: '$99' },
    badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire' },
    accent: true,
    features: [
      { text: { ar: 'كل ما في مبتدئ', fr: 'Tout ce qui est dans Starter' }, included: true },
      { text: { ar: 'تحميل كود المتجر', fr: 'Télécharger le code boutique' }, included: true, highlight: true },
      { text: { ar: 'تحميل كود التطبيق', fr: 'Télécharger le code app' }, included: true, highlight: true },
      { text: { ar: 'قوالب إضافية', fr: 'Thèmes supplémentaires' }, included: true },
      { text: { ar: 'دعم ذو أولوية', fr: 'Support prioritaire' }, included: true },
      { text: { ar: 'كود المنصة كاملاً', fr: 'Code source plateforme' }, included: false },
    ],
  },
  {
    id: 'agency',
    name: { ar: 'وكالة', fr: 'Agence' },
    price: { dzd: '49,000', usd: '$299' },
    badge: null,
    accent: false,
    features: [
      { text: { ar: 'كل ما في احترافي', fr: 'Tout ce qui est dans Pro' }, included: true },
      { text: { ar: 'كود المنصة كاملاً', fr: 'Code source plateforme complet' }, included: true, highlight: true },
      { text: { ar: 'حق إعادة البيع', fr: 'Droit de revente' }, included: true, highlight: true },
      { text: { ar: 'إعادة تسمية العلامة التجارية', fr: 'White-labeling' }, included: true },
      { text: { ar: 'دعم مباشر (واتساب)', fr: 'Support direct (WhatsApp)' }, included: true },
    ],
  },
]

const T = {
  title: { ar: 'الأسعار', fr: 'Tarifs' },
  sub: {
    ar: 'دفع مرة واحدة. لا اشتراكات شهرية. لا مفاجآت.',
    fr: 'Paiement unique. Pas d\'abonnements. Pas de surprises.',
  },
  once: { ar: 'دفع مرة واحدة', fr: 'Paiement unique' },
  cta: { ar: 'ابدأ الآن', fr: 'Commencer' },
  login: { ar: 'ادخل للوحة التحكم', fr: 'Tableau de bord' },
  faq: { ar: 'أسئلة شائعة', fr: 'FAQ' },
  faqs: [
    {
      q: { ar: 'هل الدفع مرة واحدة حقيقي؟', fr: 'Le paiement est-il vraiment unique?' },
      a: {
        ar: 'نعم. تدفع مرة واحدة وتحصل على الوصول الدائم. لا تجديد سنوي.',
        fr: 'Oui. Vous payez une fois et obtenez un accès permanent. Pas de renouvellement.',
      },
    },
    {
      q: { ar: 'ما الفرق بين تحميل كود المتجر وكود التطبيق؟', fr: 'Quelle est la différence entre le code boutique et le code app?' },
      a: {
        ar: 'كود المتجر هو مشروع الـ TanStack Start الكامل لصفحة البيع. كود التطبيق هو نسخة التطبيق للهاتف المحمول.',
        fr: 'Le code boutique est le projet TanStack Start complet. Le code app est la version mobile.',
      },
    },
    {
      q: { ar: 'هل يمكنني الترقية لاحقاً؟', fr: 'Puis-je mettre à niveau plus tard?' },
      a: {
        ar: 'نعم، تدفع الفرق فقط عند الترقية.',
        fr: 'Oui, vous ne payez que la différence lors de la mise à niveau.',
      },
    },
  ],
}

// ─── Component ────────────────────────────────────────────────────────────────

function PricingPage() {
  const { t, toggle, lang } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Nav */}
      <nav className="border-b-2 border-black px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-black">🏪 7aba.store</Link>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="text-sm border border-black px-3 py-1 font-bold hover:bg-black hover:text-white transition-colors">
              {lang === 'ar' ? 'FR' : 'AR'}
            </button>
            <Link
              to="/dashboard"
              className="text-sm font-bold border-2 border-black px-4 py-1.5 bg-yellow-400 shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {t(T.login)}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 text-center border-b-2 border-black">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-yellow-400 px-4 py-1.5 mb-6 text-sm font-black">
            <Zap size={14} />
            {t(T.sub)}
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-black leading-tight">
            {t(T.title)}
          </h1>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative flex flex-col p-7 border-2 border-black',
                tier.accent
                  ? 'bg-yellow-400 shadow-[6px_6px_0px_0px_#000]'
                  : 'bg-white shadow-[4px_4px_0px_0px_#000]'
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-yellow-400 text-xs font-black px-3 py-1 whitespace-nowrap">
                  {t(tier.badge)}
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-black text-black">{t(tier.name)}</h2>
                <div className="mt-3">
                  <span className="text-4xl font-black text-black">{tier.price.dzd}</span>
                  <span className="text-sm font-medium ms-1.5 text-black/60">DZD</span>
                </div>
                <div className="text-xs mt-1 text-black/50">
                  {tier.price.usd} · {t(T.once)}
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-7">
                {tier.features.map((f, i) => (
                  <li key={i} className={cn('flex items-start gap-2.5 text-sm', !f.included && 'opacity-40')}>
                    {f.included
                      ? <Check size={15} className={cn('mt-0.5 shrink-0', f.highlight ? 'text-black' : 'text-black/70')} strokeWidth={2.5} />
                      : <X size={15} className="mt-0.5 shrink-0 text-black/40" strokeWidth={2} />
                    }
                    <span className={cn(f.highlight && 'font-bold')}>{t(f.text)}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard"
                className={cn(
                  'block text-center text-sm font-black py-3 border-2 border-black transition-all',
                  tier.accent
                    ? 'bg-black text-yellow-400 hover:bg-zinc-900'
                    : 'bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                )}
              >
                {t(T.cta)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t-2 border-black bg-zinc-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black mb-10 text-center">{t(T.faq)}</h2>
          <div className="space-y-5">
            {T.faqs.map((item, i) => (
              <div key={i} className="border-2 border-black p-5 bg-white shadow-[3px_3px_0px_0px_#000]">
                <p className="font-black text-sm">{t(item.q)}</p>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{t(item.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

