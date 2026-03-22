import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { Link } from '@tanstack/react-router'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

const T = {
  title: { ar: 'اختر باقتك', fr: 'Choisissez votre forfait' },
  sub: {
    ar: 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت.',
    fr: "Payez une fois. Pas d'abonnements. Pas de surprises.",
  },
  cta: { ar: 'اختر هذه الباقة', fr: 'Choisir ce forfait' },
  once: { ar: 'دفع مرة واحدة', fr: 'Paiement unique' },
  everything: { ar: 'كل ميزات', fr: 'Tout de' },
  plus: { ar: 'بالإضافة إلى', fr: 'En plus' },
  compareTitle: { ar: 'مقارنة الباقات', fr: 'Comparer les forfaits' },
  faqTitle: { ar: 'الأسئلة الشائعة', fr: 'Questions fréquentes' },
}

const tiers = [
  {
    id: 'simple',
    name: { ar: 'بسيط', fr: 'Simple' },
    dzd: '3,900',
    usd: '$29',
    badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire' },
    accent: true,
    features: [
      { ar: 'نشر على Cloudflare', fr: 'Déploiement sur Cloudflare' },
      { ar: 'InstantDB مخصص', fr: 'InstantDB dédié' },
      { ar: 'نموذج طلبات', fr: 'Formulaire de commandes' },
      { ar: '3 قوالب', fr: '3 thèmes' },
      { ar: 'لوحة تحكم', fr: 'Tableau de bord' },
      { ar: 'إشعارات فورية', fr: 'Notifications en temps réel' },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', fr: 'Pro' },
    dzd: '14,900',
    usd: '$99',
    badge: null,
    accent: false,
    parent: { ar: 'بسيط', fr: 'Simple' },
    features: [
      { ar: 'الكود المصدري', fr: 'Code source' },
      { ar: 'رفع على GitHub', fr: 'Publication sur GitHub' },
      { ar: 'تخصيص كامل', fr: 'Personnalisation complète' },
    ],
  },
  {
    id: 'studio',
    name: { ar: 'ستوديو', fr: 'Studio' },
    dzd: '49,000',
    usd: '$299',
    badge: null,
    accent: false,
    parent: { ar: 'احترافي', fr: 'Pro' },
    features: [
      { ar: '5 متاجر', fr: '5 boutiques' },
      { ar: 'دعم مخصص', fr: 'Support dédié' },
      { ar: 'نطاق مخصص', fr: 'Domaine personnalisé' },
    ],
  },
  {
    id: 'partner',
    name: { ar: 'راعي', fr: 'Partenaire' },
    dzd: '99,000+',
    usd: '$500+',
    badge: null,
    accent: false,
    parent: { ar: 'ستوديو', fr: 'Studio' },
    features: [
      { ar: 'كود المنصة كاملاً', fr: 'Code complet de la plateforme' },
      { ar: 'تدريب الفريق', fr: "Formation de l'équipe" },
      { ar: 'دعم مباشر', fr: 'Support direct' },
    ],
  },
]

const compareFeatures = [
  { ar: 'نشر على Cloudflare', fr: 'Déploiement Cloudflare', simple: true, pro: true, studio: true, partner: true },
  { ar: 'InstantDB مخصص', fr: 'InstantDB dédié', simple: true, pro: true, studio: true, partner: true },
  { ar: 'نموذج طلبات', fr: 'Formulaire commandes', simple: true, pro: true, studio: true, partner: true },
  { ar: '3 قوالب', fr: '3 thèmes', simple: true, pro: true, studio: true, partner: true },
  { ar: 'لوحة تحكم', fr: 'Tableau de bord', simple: true, pro: true, studio: true, partner: true },
  { ar: 'إشعارات فورية', fr: 'Notifications', simple: true, pro: true, studio: true, partner: true },
  { ar: 'الكود المصدري', fr: 'Code source', simple: false, pro: true, studio: true, partner: true },
  { ar: 'رفع على GitHub', fr: 'GitHub', simple: false, pro: true, studio: true, partner: true },
  { ar: 'تخصيص كامل', fr: 'Personnalisation complète', simple: false, pro: true, studio: true, partner: true },
  { ar: '5 متاجر', fr: '5 boutiques', simple: false, pro: false, studio: true, partner: true },
  { ar: 'دعم مخصص', fr: 'Support dédié', simple: false, pro: false, studio: true, partner: true },
  { ar: 'نطاق مخصص', fr: 'Domaine personnalisé', simple: false, pro: false, studio: true, partner: true },
  { ar: 'كود المنصة كاملاً', fr: 'Code plateforme', simple: false, pro: false, studio: false, partner: true },
  { ar: 'تدريب الفريق', fr: "Formation équipe", simple: false, pro: false, studio: false, partner: true },
  { ar: 'دعم مباشر', fr: 'Support direct', simple: false, pro: false, studio: false, partner: true },
]

const faqs = [
  {
    q: { ar: 'ما الفرق بين الباقات؟', fr: 'Quelle est la différence entre les forfaits?' },
    a: {
      ar: 'الباقة البسيطة تمنحك متجراً جاهزاً على Cloudflare. الاحترافية تضيف الكود المصدري لتعديله بالكامل. ستوديو مناسب للوكالات (5 متاجر). راعي للمطورين الذين يريدون المنصة كاملاً.',
      fr: 'Simple vous donne une boutique prête sur Cloudflare. Pro ajoute le code source pour une personnalisation complète. Studio convient aux agences (5 boutiques). Partenaire pour les développeurs qui veulent la plateforme entière.',
    },
  },
  {
    q: { ar: 'هل أحتاج خبرة تقنية لاستخدام المنصة؟', fr: 'Ai-je besoin de compétences techniques?' },
    a: {
      ar: 'لا! المنصة مصممة ليستخدمها أي تاجر بدون خبرة تقنية. فقط اختر قالبك، خصص المحتوى، وانشر.',
      fr: 'Non! La plateforme est conçue pour être utilisée par n\'importe quel marchand sans compétences techniques.',
    },
  },
  {
    q: { ar: 'ماذا يحدث لمتجري إذا توقفت المنصة؟', fr: 'Que se passe-t-il si la plateforme s\'arrête?' },
    a: {
      ar: 'متجرك يعمل على Cloudflare بشكل مستقل تماماً عن منصة 7aba. حتى لو أغلقنا الخدمة، متجرك يستمر للأبد.',
      fr: 'Votre boutique fonctionne sur Cloudflare indépendamment de la plateforme 7aba. Même si nous fermons, votre boutique continue.',
    },
  },
  {
    q: { ar: 'كيف أدفع؟', fr: 'Comment payer?' },
    a: {
      ar: 'نقبل CCP، Baridi Mob، ووسائل دفع أخرى. تواصل معنا عبر WhatsApp لإتمام الدفع.',
      fr: 'Nous acceptons CCP, Baridi Mob et autres moyens de paiement. Contactez-nous via WhatsApp.',
    },
  },
  {
    q: { ar: 'هل يمكنني تغيير القالب بعد النشر؟', fr: 'Puis-je changer de thème après déploiement?' },
    a: {
      ar: 'نعم! يمكنك تغيير القالب وإعادة النشر في أي وقت بنقرة واحدة.',
      fr: 'Oui! Vous pouvez changer de thème et redéployer à tout moment en un clic.',
    },
  },
  {
    q: { ar: 'ما هو إنفراستراكتشر المتجر؟', fr: 'Quelle est l\'infrastructure de la boutique?' },
    a: {
      ar: 'كل متجر يعمل على Cloudflare Workers (CDN عالمي) مع InstantDB لقاعدة البيانات في الوقت الفعلي. سرعة تحميل أقل من 100ms في الجزائر.',
      fr: 'Chaque boutique fonctionne sur Cloudflare Workers (CDN mondial) avec InstantDB pour la base de données en temps réel.',
    },
  },
]

function FaqItem({ q, a }: { q: { ar: string; fr: string }; a: { ar: string; fr: string } }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-start font-semibold text-gray-900 hover:text-orange-600 transition-colors"
      >
        <span>{t(q)}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 shrink-0 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <p className="pb-4 text-gray-500 leading-relaxed text-sm">{t(a)}</p>
      )}
    </div>
  )
}

function PricingPage() {
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          {t(T.title)}
        </h1>
        <p className="text-lg text-gray-500">{t(T.sub)}</p>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative rounded-2xl p-6 flex flex-col gap-4 border',
                tier.accent
                  ? 'bg-orange-500 border-orange-400 text-white shadow-xl shadow-orange-200'
                  : 'bg-white border-gray-200 text-gray-900'
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-gray-900 text-white whitespace-nowrap">
                  {t(tier.badge)}
                </span>
              )}

              <h3 className={cn('text-lg font-bold', tier.accent ? 'text-white' : 'text-gray-900')}>
                {t(tier.name)}
              </h3>

              <div>
                <div className={cn('text-3xl font-black', tier.accent ? 'text-white' : 'text-gray-900')}>
                  {tier.dzd}
                  <span className="text-sm font-medium ms-1">DZD</span>
                </div>
                <div className={cn('text-xs mt-0.5', tier.accent ? 'text-orange-100' : 'text-gray-400')}>
                  {tier.usd} · {t(T.once)}
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {tier.parent && (
                  <li className={cn('text-xs font-semibold', tier.accent ? 'text-orange-100' : 'text-gray-400')}>
                    {t(T.everything)} {t(tier.parent)} +
                  </li>
                )}
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check
                      className={cn('w-4 h-4 shrink-0', tier.accent ? 'text-orange-100' : 'text-orange-500')}
                      strokeWidth={2.5}
                    />
                    <span className={tier.accent ? 'text-white' : 'text-gray-700'}>{t(f)}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/pricing"
                className={cn(
                  'text-center text-sm font-semibold py-2.5 rounded-xl transition-all',
                  tier.accent
                    ? 'bg-white text-orange-600 hover:bg-orange-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
              >
                {t(T.cta)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section id="compare" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">
            {t(T.compareTitle)}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className="text-start px-5 py-4 font-semibold text-gray-500 w-2/5" />
                  <th className="px-5 py-4 text-center font-bold text-orange-600 bg-orange-50 border-x border-orange-100">
                    {t({ ar: 'بسيط', fr: 'Simple' })}
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-700">
                    {t({ ar: 'احترافي', fr: 'Pro' })}
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-700">
                    {t({ ar: 'ستوديو', fr: 'Studio' })}
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-gray-700">
                    {t({ ar: 'راعي', fr: 'Partenaire' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-600">{t(row)}</td>
                    {(['simple', 'pro', 'studio', 'partner'] as const).map((col) => (
                      <td
                        key={col}
                        className={cn(
                          'px-5 py-3 text-center',
                          col === 'simple' && 'bg-orange-50/40 border-x border-orange-50'
                        )}
                      >
                        {row[col] ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" strokeWidth={2.5} />
                        ) : (
                          <span className="text-gray-300 text-lg">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">
            {t(T.faqTitle)}
          </h2>
          <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 px-6">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
