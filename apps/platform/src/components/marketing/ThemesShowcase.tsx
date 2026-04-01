/**
 * ThemesShowcase — shows the 3 store themes + payment methods on the marketing landing page.
 * Informs visitors that all tiers (including starter) can customize themes from the builder.
 */
import { useLang } from '@/hooks/useLang'
import { Palette, Banknote, CreditCard, Check } from 'lucide-react'

const T = {
  heading: {
    ar: 'قوالب احترافية + طرق دفع متعددة',
    fr: 'Thèmes professionnels + multiples méthodes de paiement',
    en: 'Professional themes + multiple payment methods',
  },
  subheading: {
    ar: 'اختر قالبك وخصّص ألوانك من المحرر — متاح لجميع الباقات بما فيها Starter.',
    fr: 'Choisissez votre thème et personnalisez les couleurs depuis l\'éditeur — disponible pour tous les abonnements.',
    en: 'Pick your theme and customise colours from the builder — available on all plans including Starter.',
  },
  themes: [
    {
      name: { ar: 'جريء', fr: 'Audacieux', en: 'Brutalist' },
      desc: { ar: 'أبيض وأسود وأصفر — قوي ومباشر', fr: 'Noir, blanc et jaune — fort et direct', en: 'Black, white & yellow — strong and direct' },
      bg: '#fff',
      accent: '#FACC15',
      text: '#000',
      border: '#000',
    },
    {
      name: { ar: 'داكن', fr: 'Sombre', en: 'Acquisition' },
      desc: { ar: 'خلفية سوداء + برتقالي — يُحوّل الزوار', fr: 'Fond noir + orange — convertit les visiteurs', en: 'Dark + orange — converts visitors' },
      bg: '#0A0A0A',
      accent: '#F97316',
      text: '#fff',
      border: '#222',
    },
    {
      name: { ar: 'دافئ', fr: 'Chaleureux', en: 'Warm' },
      desc: { ar: 'ألوان عنبرية دافئة — يمنح الثقة', fr: 'Tons ambrés chaleureux — inspire la confiance', en: 'Warm amber tones — builds trust' },
      bg: '#FFFBF5',
      accent: '#B45309',
      text: '#1C1917',
      border: '#D97706',
    },
  ],
  paymentHeading: {
    ar: 'طريقتا دفع في متجرك',
    fr: 'Deux méthodes de paiement dans votre boutique',
    en: 'Two payment methods in your store',
  },
  cod: {
    label: { ar: 'الدفع عند الاستلام', fr: 'Paiement à la livraison', en: 'Cash on Delivery' },
    desc: { ar: 'مجاني دائماً — الزبون يدفع عند الاستلام بلا بطاقة', fr: 'Toujours gratuit — le client paie à la livraison', en: 'Always free — customer pays on delivery, no card needed' },
  },
  online: {
    label: { ar: 'دفع إلكتروني Chargily Pay', fr: 'Paiement en ligne Chargily Pay', en: 'Online Payment via Chargily Pay' },
    desc: { ar: 'CIB، Dahabia — الدفع الإلكتروني الجزائري', fr: 'CIB, Dahabia — paiement en ligne algérien', en: 'CIB, Dahabia — Algerian online payment' },
  },
  both: {
    label: { ar: 'كلاهما معاً', fr: 'Les deux ensemble', en: 'Both together' },
    desc: { ar: 'فعّل الاثنين وامنح الزبون الخيار', fr: 'Activez les deux et laissez le client choisir', en: 'Enable both and let the customer choose' },
  },
  starterNote: {
    ar: '✓ تخصيص الثيم متاح لجميع الباقات',
    fr: '✓ Personnalisation du thème disponible sur tous les abonnements',
    en: '✓ Theme customisation available on all plans',
  },
}

export function ThemesShowcase() {
  const { t, dir } = useLang()

  return (
    <section className="py-24 px-4 bg-black text-white" dir={dir}>
      <div className="max-w-6xl mx-auto space-y-20">

        {/* === Themes === */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center shrink-0">
              <Palette className="w-5 h-5 text-black" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-black">{t(T.heading)}</h2>
          </div>
          <p className="text-white/60 text-sm mb-10 max-w-xl">{t(T.subheading)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {T.themes.map((theme, i) => (
              <div
                key={i}
                className="border-2 overflow-hidden"
                style={{ borderColor: theme.border === '#000' ? '#333' : theme.border }}
              >
                {/* Mini store preview */}
                <div
                  className="h-40 p-4 flex flex-col justify-between"
                  style={{ backgroundColor: theme.bg, color: theme.text }}
                >
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-2/3 rounded-sm" style={{ backgroundColor: theme.accent }} />
                    <div className="h-1.5 w-full rounded-sm opacity-30" style={{ backgroundColor: theme.text }} />
                    <div className="h-1.5 w-4/5 rounded-sm opacity-20" style={{ backgroundColor: theme.text }} />
                  </div>
                  <div
                    className="text-xs font-black px-3 py-1.5 self-end border"
                    style={{
                      backgroundColor: theme.accent,
                      color: theme.bg === '#0A0A0A' ? '#fff' : '#000',
                      borderColor: theme.border,
                    }}
                  >
                    {t({ ar: 'اطلب الآن', fr: 'Commander', en: 'Order now' })}
                  </div>
                </div>

                {/* Label */}
                <div className="bg-zinc-900 border-t border-zinc-700 px-4 py-3">
                  <p className="font-black text-white text-sm">{t(theme.name)}</p>
                  <p className="text-white/50 text-xs mt-0.5">{t(theme.desc)}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-yellow-400 font-semibold">{t(T.starterNote)}</p>
        </div>

        {/* === Payment Methods === */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-black" strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-black">{t(T.paymentHeading)}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* COD */}
            <div className="border border-zinc-700 bg-zinc-900 p-5 space-y-3">
              <div className="w-10 h-10 bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-black text-white">{t(T.cod.label)}</p>
              <p className="text-white/50 text-sm leading-relaxed">{t(T.cod.desc)}</p>
              <span className="inline-flex items-center gap-1 text-xs text-green-400 font-medium">
                <Check size={12} /> {t({ ar: 'مجاني ومتاح دائماً', fr: 'Gratuit et toujours disponible', en: 'Free & always available' })}
              </span>
            </div>

            {/* Chargily */}
            <div className="border border-zinc-700 bg-zinc-900 p-5 space-y-3">
              <div className="w-10 h-10 bg-zinc-800 border border-zinc-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-black text-white">{t(T.online.label)}</p>
              <p className="text-white/50 text-sm leading-relaxed">{t(T.online.desc)}</p>
              <span className="inline-flex items-center gap-1 text-xs text-yellow-400 font-medium">
                <Check size={12} /> {t({ ar: 'بطاقة CIB + Dahabia', fr: 'Carte CIB + Dahabia', en: 'CIB card + Dahabia' })}
              </span>
            </div>

            {/* Both */}
            <div className="border border-yellow-400/40 bg-yellow-400/5 p-5 space-y-3">
              <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-black text-white">{t(T.both.label)}</p>
              <p className="text-white/50 text-sm leading-relaxed">{t(T.both.desc)}</p>
              <span className="inline-flex items-center gap-1 text-xs text-yellow-400 font-medium">
                <Check size={12} /> {t({ ar: 'تُفعّل من المحرر', fr: 'Activé depuis l\'éditeur', en: 'Activated from the builder' })}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
