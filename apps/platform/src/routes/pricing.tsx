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
      { ar: 'إشعارات FOMO للزبائن', fr: 'Notifications FOMO clients' },
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
  { ar: 'إشعارات FOMO للزبائن', fr: 'Notifications FOMO', simple: true, pro: true, studio: true, partner: true },
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
      fr: "Non! La plateforme est conçue pour être utilisée par n'importe quel marchand sans compétences techniques.",
    },
  },
  {
    q: { ar: 'ماذا يحدث لمتجري إذا توقفت المنصة؟', fr: "Que se passe-t-il si la plateforme s'arrête?" },
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
    q: { ar: 'ما هو إنفراستراكتشر المتجر؟', fr: "Quelle est l'infrastructure de la boutique?" },
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
    <div className="border-b-2 border-black last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-start font-black text-black hover:text-yellow-600 transition-colors"
      >
        <span>{t(q)}</span>
        <ChevronDown
          className={cn('w-5 h-5 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <p className="pb-5 text-black/60 leading-relaxed text-sm text-right">{t(a)}</p>
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
      <section className="pt-32 pb-16 px-4 text-center border-b-2 border-black bg-white"
        style={{
          backgroundImage: 'linear-gradient(#00000008 1px, transparent 1px), linear-gradient(90deg, #00000008 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <h1 className="text-4xl lg:text-6xl font-black text-black mb-4">
          {t(T.title)}
        </h1>
        <p className="text-lg text-black/60 font-medium">{t(T.sub)}</p>
      </section>

      {/* Pricing cards */}
      <section className="py-24 px-4 border-b-2 border-black">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative p-6 flex flex-col gap-4 border-2 border-black',
                tier.accent
                  ? 'bg-yellow-400 shadow-[6px_6px_0px_0px_#000]'
                  : 'bg-white shadow-[4px_4px_0px_0px_#000]'
              )}
            >
              {tier.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 bg-black text-yellow-400 whitespace-nowrap border-2 border-black">
                  {t(tier.badge)}
                </span>
              )}

              <h3 className="text-lg font-black text-black">
                {t(tier.name)}
              </h3>

              <div>
                <div className="text-3xl font-black text-black">
                  {tier.dzd}
                  <span className="text-sm font-bold ms-1">DZD</span>
                </div>
                <div className="text-xs mt-0.5 text-black/50 font-medium">
                  {tier.usd} · {t(T.once)}
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {tier.parent && (
                  <li className="text-xs font-black text-black/50 border-b border-black/20 pb-2">
                    {t(T.everything)} {t(tier.parent)} +
                  </li>
                )}
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      'w-4 h-4 flex items-center justify-center shrink-0 border border-black',
                      tier.accent ? 'bg-black text-yellow-400' : 'bg-yellow-400 text-black'
                    )}>
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-black font-medium">{t(f)}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/dashboard/builder"
                search={{ storeId: 'new', plan: tier.id }}
                className={cn(
                  'text-center text-sm font-black py-2.5 border-2 border-black transition-all',
                  'shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
                  tier.accent
                    ? 'bg-black text-yellow-400'
                    : 'bg-yellow-400 text-black'
                )}
              >
                {t(T.cta)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section id="compare" className="py-24 px-4 border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-black mb-12 border-r-4 border-yellow-400 pr-4 text-right">
            {t(T.compareTitle)}
          </h2>
          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-black text-white">
                  <th className="text-start px-5 py-4 font-black w-2/5 text-white/60" />
                  <th className="px-5 py-4 text-center font-black text-yellow-400 border-x-2 border-yellow-400 bg-yellow-400/20">
                    {t({ ar: 'بسيط', fr: 'Simple' })}
                  </th>
                  <th className="px-5 py-4 text-center font-bold text-white/80">
                    {t({ ar: 'احترافي', fr: 'Pro' })}
                  </th>
                  <th className="px-5 py-4 text-center font-bold text-white/80">
                    {t({ ar: 'ستوديو', fr: 'Studio' })}
                  </th>
                  <th className="px-5 py-4 text-center font-bold text-white/80">
                    {t({ ar: 'راعي', fr: 'Partenaire' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((row, i) => (
                  <tr key={i} className="border-b-2 border-black last:border-0 hover:bg-yellow-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-black">{t(row)}</td>
                    {(['simple', 'pro', 'studio', 'partner'] as const).map((col) => (
                      <td
                        key={col}
                        className={cn(
                          'px-5 py-3 text-center',
                          col === 'simple' && 'bg-yellow-50 border-x-2 border-yellow-400'
                        )}
                      >
                        {row[col] ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-400 border border-black mx-auto">
                            <Check className="w-3 h-3 text-black" strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="text-black/20 text-lg font-black">—</span>
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
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-black mb-12 border-r-4 border-yellow-400 pr-4 text-right">
            {t(T.faqTitle)}
          </h2>
          <div className="border-2 border-black px-6">
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
