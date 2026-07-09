import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'
import { FirstBatchCountdown } from '@/components/marketing/FirstBatchCountdown'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIERS, ONCE_LABEL, contactWhatsappUrl, CONTACT_EMAIL } from '@/config/pricing'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

const RUN_ONE_MSG = {
  ar: 'مرحباً، أنا مهتم بباقة Run One على 7aba.',
  fr: 'Bonjour, je suis intéressé par le forfait Run One sur 7aba.',
  en: 'Hi, I am interested in the Run One plan on 7aba.',
}

const faqs = [
  {
    q: { ar: 'هل الدفع مرة واحدة فعلاً؟', fr: 'Le paiement est-il vraiment unique?', en: 'Is it really a one-time payment?' },
    a: { ar: 'نعم. تدفع مرة واحدة وتحصل على الوصول كاملاً بدون اشتراك شهري أو سنوي. لكن أسعار الدفعة الأولى تنتهي في 31 جويلية 2026.', fr: "Oui. Vous payez une seule fois, sans abonnement. Mais les tarifs 1re vague se terminent le 31 juillet 2026.", en: 'Yes. You pay once, no monthly or annual subscription. But first-batch prices end on 31 July 2026.' },
  },
  {
    q: { ar: 'ماذا يحدث بعد 31 جويلية 2026؟', fr: 'Que se passe-t-il après le 31 juillet 2026?', en: 'What happens after 31 July 2026?' },
    a: { ar: 'ترتفع الأسعار: المبتدئ يصبح محدوداً بـ10 متاجر ثم 3,000 دج لكل متجر إضافي، المستقل يصبح 100,000 دج، وRun One يتضاعف. من يشترِ الآن يثبّت السعر والمزايا للأبد.', fr: "Les tarifs augmentent : Starter passe à 10 boutiques puis 3 000 DZD/boutique, Freelancer à 100 000 DZD, et Run One double. Achetez maintenant pour verrouiller le prix à vie.", en: 'Prices rise: Starter becomes capped at 10 stores then 3,000 DZD each, Freelancer becomes 100,000 DZD, and Run One doubles. Buy now to lock the price and perks forever.' },
  },
  {
    q: { ar: 'ما طرق الدفع المتاحة في متاجري؟', fr: 'Quels modes de paiement dans mes boutiques?', en: 'What payment methods are available in my stores?' },
    a: {
      ar: 'متجرك يدعم طريقتين: الدفع عند الاستلام (COD) مجاناً دائماً، ودفع إلكتروني عبر Chargily Pay (بطاقة CIB، Dahabia).',
      fr: "Votre boutique supporte deux méthodes : Paiement à la livraison (COD) toujours gratuit, et paiement en ligne via Chargily Pay (CIB, Dahabia).",
      en: 'Your store supports two methods: Cash on Delivery (COD) always free, and online payment via Chargily Pay (CIB, Dahabia).',
    },
  },
  {
    q: { ar: 'ماذا أحتاج لنشر متجري؟', fr: 'De quoi ai-je besoin pour déployer ma boutique?', en: 'What do I need to deploy my store?' },
    a: {
      ar: 'تحتاج حساب Cloudflare مجاني وحساب InstantDB مجاني. المنصة ستساعدك على إعدادهم خطوة بخطوة.',
      fr: "Vous avez besoin d'un compte Cloudflare gratuit et d'un compte InstantDB gratuit. La plateforme vous guide étape par étape.",
      en: 'You need a free Cloudflare account and a free InstantDB account. The platform guides you step by step.',
    },
  },
]

function PricingPage() {
  const { t, lang, dir } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white text-center border-b-4 border-yellow-400">
        <span className="inline-block bg-yellow-400 text-black text-sm font-black px-4 py-1.5 mb-5 border-2 border-yellow-400">
          {t(ONCE_LABEL)} · {t({ ar: 'لا اشتراكات', fr: 'Pas d\'abonnement', en: 'No subscriptions' })}
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {t({ ar: 'الأسعار', fr: 'Tarifs', en: 'Pricing' })}
        </h1>
        <p className="text-white/60 text-lg max-w-lg mx-auto mb-8">
          {t({ ar: 'ادفع مرة واحدة. امتلك للأبد. الأسعار ترتفع بعد الدفعة الأولى.', fr: "Payez une fois. Possédez à vie. Les tarifs montent après la 1re vague.", en: 'Pay once. Own it forever. Prices rise after the first batch.' })}
        </p>
        <div className="flex justify-center">
          <FirstBatchCountdown variant="dark" />
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
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
                <p className="text-3xl font-black text-black mt-1">{t(tier.priceLabel)}</p>
                <p className="text-xs font-bold text-black/50 mt-0.5">{t(ONCE_LABEL)}</p>
                <p className="text-xs text-red-600 font-bold mt-2 line-through decoration-2">
                  {t(tier.afterLabel)}
                </p>
              </div>
              <ul className="space-y-2 flex-1">
                {tier.features[lang].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black">
                    <Check size={14} className="mt-0.5 shrink-0 text-black" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              {tier.checkout === 'contact' ? (
                <a
                  href={contactWhatsappUrl(t(RUN_ONE_MSG))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'block text-center font-black py-2.5 border-2 border-black transition-all text-sm',
                    'bg-white text-black hover:bg-yellow-400',
                  )}
                >
                  {t({ ar: 'تواصل معنا', fr: 'Contactez-nous', en: 'Contact us' })}
                </a>
              ) : (
                <Link
                  to="/dashboard"
                  search={{ plan: tier.id }}
                  className={cn(
                    'block text-center font-black py-2.5 border-2 border-black transition-all text-sm',
                    tier.accent ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-yellow-400',
                  )}
                >
                  {t({ ar: 'اشترك الآن', fr: 'S\'abonner', en: 'Subscribe now' })}
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-black/50 mt-6">
          {t({ ar: 'باقة Run One عبر تواصل مباشر:', fr: 'Run One par contact direct :', en: 'Run One via direct contact:' })}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-bold">{CONTACT_EMAIL}</a>
        </p>
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
