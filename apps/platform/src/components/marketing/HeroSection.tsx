import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ThemeProvider, HeroSection as StoreHeroSection, brutalistTheme } from '@7aba/store-ui'
import type { HeroContent } from '@7aba/store-ui'

const T = {
  headline: { ar: 'أطلق متجرك الإلكتروني في دقيقتين', fr: 'Lancez votre boutique en 2 minutes' },
  sub: {
    ar: 'منصة بناء المتاجر للتجار الجزائريين. ادفع مرة واحدة، اكتسب كل شيء.',
    fr: 'La plateforme e-commerce pour les marchands algériens. Payez une fois, possédez tout.',
  },
  cta1: { ar: 'اختر باقتك', fr: 'Choisir votre forfait' },
  cta2: { ar: 'كيف يعمل؟', fr: 'Comment ça marche?' },
}

const demoHeroContent: HeroContent = {
  title: ['حزام واحد', 'يحكم الكل'],
  description: 'صاكادو يد وحدة: يرفد بزاف ويبان صغير. خفيف، مريح، يخدم القراية والسبور والخرجات',
  ctaText: 'اشتر الآن',
  ctaLink: '#buy',
  image: '',
  priceTag: { amount: '2500', currency: 'دج' },
  freeDelivery: true,
}

export function HeroSection() {
  const { t } = useLang()

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Gradient overlay to fade dots at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, white 100%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
          🇩🇿 صنع في الجزائر
        </span>

        {/* Headline */}
        <h1
          className={cn(
            'text-5xl lg:text-7xl font-black leading-tight text-gray-900',
            'tracking-tight'
          )}
        >
          {t(T.headline)}
        </h1>

        {/* Sub */}
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          {t(T.sub)}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            to="/pricing"
            className={cn(
              'px-8 py-3 rounded-xl font-bold text-base',
              'bg-orange-500 text-white hover:bg-orange-600',
              'shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5'
            )}
          >
            {t(T.cta1)}
          </Link>
          <a
            href="#how"
            className={cn(
              'px-8 py-3 rounded-xl font-semibold text-base',
              'bg-white text-gray-700 border border-gray-200',
              'hover:bg-gray-50 transition-all hover:-translate-y-0.5'
            )}
          >
            {t(T.cta2)}
          </a>
        </div>

        {/* Live store preview mockup */}
        <div
          className="relative mt-12 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <div className="bg-gray-900 rounded-t-2xl px-4 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="flex-1 text-center text-xs text-gray-400">
              mystore.7aba.store
            </span>
          </div>
          <div
            className="relative overflow-hidden bg-white"
            style={{ height: '340px' }}
          >
            <div
              style={{
                transform: 'scale(0.52)',
                transformOrigin: 'top center',
                width: '192%',
                marginLeft: '-46%',
                pointerEvents: 'none',
              }}
            >
              <ThemeProvider value={brutalistTheme}>
                <StoreHeroSection content={demoHeroContent} />
              </ThemeProvider>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  )
}
