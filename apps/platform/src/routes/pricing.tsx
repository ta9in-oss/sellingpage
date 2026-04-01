import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

const tiers = [
  {
    id: 'starter',
    name: { ar: 'مبتدئ', fr: 'Starter', en: 'Starter' },
    price: { ar: '3,900 دج', fr: '3 900 DZD', en: '3,900 DZD' },
    badge: null,
    accent: false,
    features: {
      ar: [
        'إنشاء ونشر عدد غير محدود من المتاجر',
        'محرر بصري كامل (12 نوع قسم)',
        '3 ثيمات احترافية + تخصيص كامل',
        'دفع عند الاستلام (COD) — مجاني دائماً',
        'دفع إلكتروني Chargily Pay (CIB، Dahabia)',
        'نطاق مخصص عبر Cloudflare',
        'لوحة إدارة الطلبات',
        'Google Analytics + Meta Pixel',
      ],
      fr: [
        'Créer et publier des boutiques illimitées',
        'Éditeur visuel complet (12 types de sections)',
        '3 thèmes professionnels + personnalisation',
        'Paiement à la livraison (COD) — toujours gratuit',
        'Paiement en ligne Chargily Pay (CIB, Dahabia)',
        'Domaine personnalisé via Cloudflare',
        'Tableau de bord commandes',
        'Google Analytics + Meta Pixel',
      ],
      en: [
        'Create and publish unlimited stores',
        'Full visual builder (12 section types)',
        '3 professional themes + full customisation',
        'Cash on Delivery (COD) — always free',
        'Online payment via Chargily Pay (CIB, Dahabia)',
        'Custom domain via Cloudflare',
        'Orders management dashboard',
        'Google Analytics + Meta Pixel',
      ],
    },
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', fr: 'Pro', en: 'Pro' },
    price: { ar: '14,900 دج', fr: '14 900 DZD', en: '14,900 DZD' },
    badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire', en: 'Most popular' },
    accent: true,
    features: {
      ar: [
        'كل ما في الباقة المبتدئة',
        'تحميل كود مصدر المتجر فوراً',
        'تحميل كود تطبيق المتجر (Android)',
        'دعم ذو أولوية',
      ],
      fr: [
        'Tout ce qui est dans Starter',
        'Télécharger le code source de la boutique',
        'Télécharger le code de l\'app boutique (Android)',
        'Support prioritaire',
      ],
      en: [
        'Everything in Starter',
        'Download store source code instantly',
        'Download store app source code (Android)',
        'Priority support',
      ],
    },
  },
  {
    id: 'agency',
    name: { ar: 'وكالة', fr: 'Agence', en: 'Agency' },
    price: { ar: '49,000 دج', fr: '49 000 DZD', en: '49,000 DZD' },
    badge: null,
    accent: false,
    features: {
      ar: [
        'كل ما في الباقة الاحترافية',
        'كود المنصة الكاملة (هذه المنصة)',
        'متاجر غير محدودة',
        'دعم مباشر',
      ],
      fr: [
        'Tout ce qui est dans Pro',
        'Code source complet de la plateforme',
        'Boutiques illimitées',
        'Support direct',
      ],
      en: [
        'Everything in Pro',
        'Full platform source code (this platform)',
        'Unlimited stores',
        'Direct support',
      ],
    },
  },
]

const faqs = [
  {
    q: { ar: 'هل الدفع مرة واحدة فعلاً؟', fr: 'Le paiement est-il vraiment unique?', en: 'Is it really a one-time payment?' },
    a: { ar: 'نعم. تدفع مرة واحدة وتحصل على الوصول كاملاً بدون اشتراك شهري أو سنوي.', fr: "Oui. Vous payez une seule fois et obtenez un accès complet sans abonnement mensuel ou annuel.", en: 'Yes. You pay once and get full access with no monthly or annual subscription.' },
  },
  {
    q: { ar: 'ما طرق الدفع المتاحة في متاجري؟', fr: 'Quels modes de paiement sont disponibles dans mes boutiques?', en: 'What payment methods are available in my stores?' },
    a: {
      ar: 'متجرك يدعم طريقتين: الدفع عند الاستلام (COD) مجاناً دائماً، ودفع إلكتروني عبر Chargily Pay (بطاقة CIB، Dahabia). تختار الطريقة أو تفعّل الاثنتين معاً من المحرر.',
      fr: "Votre boutique supporte deux méthodes : Paiement à la livraison (COD) toujours gratuit, et paiement en ligne via Chargily Pay (CIB, Dahabia). Activez l'une ou les deux depuis l'éditeur.",
      en: 'Your store supports two methods: Cash on Delivery (COD) always free, and online payment via Chargily Pay (CIB, Dahabia). Choose one or enable both from the builder.',
    },
  },
  {
    q: { ar: 'هل يمكنني تخصيص ثيم المتجر؟', fr: 'Puis-je personnaliser le thème de ma boutique?', en: 'Can I customise my store theme?' },
    a: {
      ar: 'نعم، جميع الباقات بما فيها المبتدئة تتيح تخصيص الثيم كاملاً من المحرر البصري. 3 ثيمات جاهزة: جريء، داكن، دافئ.',
      fr: "Oui, tous les abonnements y compris Starter permettent la personnalisation complète du thème depuis l'éditeur visuel. 3 thèmes prêts : Audacieux, Sombre, Chaleureux.",
      en: 'Yes, all plans including Starter allow full theme customisation from the visual builder. 3 ready themes: Brutalist, Dark, Warm.',
    },
  },
  {
    q: { ar: 'ماذا أحتاج لنشر متجري؟', fr: 'De quoi ai-je besoin pour déployer ma boutique?', en: 'What do I need to deploy my store?' },
    a: {
      ar: 'تحتاج حساب Cloudflare مجاني وحساب InstantDB مجاني — المنصة ستساعدك على إعدادهم خطوة بخطوة.',
      fr: "Vous avez besoin d'un compte Cloudflare gratuit et d'un compte InstantDB gratuit — la plateforme vous guide étape par étape.",
      en: 'You need a free Cloudflare account and a free InstantDB account — the platform guides you step by step.',
    },
  },
]

function PricingPage() {
  const { t, lang, dir } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-4 bg-black text-white text-center border-b-4 border-yellow-400">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {t({ ar: 'الأسعار', fr: 'Tarifs', en: 'Pricing' })}
        </h1>
        <p className="text-white/60 text-lg max-w-lg mx-auto">
          {t({ ar: 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت.', fr: "Payez une fois. Pas d'abonnements. Pas de surprises.", en: 'Pay once. No subscriptions. No surprises.' })}
        </p>
      </section>

      {/* Tiers */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'border-2 border-black p-6 flex flex-col gap-6 relative',
                tier.accent ? 'bg-yellow-400' : 'bg-white',
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 start-4 bg-black text-white text-xs font-black px-3 py-1">
                  {t(tier.badge)}
                </span>
              )}
              <div>
                <p className="font-black text-xl text-black">{t(tier.name)}</p>
                <p className="text-3xl font-black text-black mt-1">{t(tier.price)}</p>
                <p className="text-xs text-black/50 mt-0.5">{t({ ar: 'دفع مرة واحدة', fr: 'Paiement unique', en: 'One-time payment' })}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features[lang].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black">
                    <Check size={14} className="mt-0.5 shrink-0 text-black" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                search={{ plan: tier.id }}
                className={cn(
                  'block text-center font-black py-2.5 border-2 border-black transition-all text-sm',
                  tier.accent
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-white text-black hover:bg-yellow-400',
                )}
              >
                {t({ ar: 'اشترك الآن', fr: 'S\'abonner', en: 'Subscribe now' })}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 bg-zinc-50 border-t-2 border-black">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-black mb-10 text-start">
            {t({ ar: 'أسئلة شائعة', fr: 'Questions fréquentes', en: 'Frequently Asked Questions' })}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-2 border-black bg-white p-5">
                <p className="font-black text-black mb-2">{t(faq.q)}</p>
                <p className="text-black/60 text-sm leading-relaxed">{t(faq.a)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
