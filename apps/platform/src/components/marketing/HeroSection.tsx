import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const T = {
  headline: { ar: 'أطلق متجرك الإلكتروني في دقيقتين', fr: 'Lancez votre boutique en 2 minutes' },
  sub: {
    ar: 'منصة بناء المتاجر للتجار الجزائريين. ادفع مرة واحدة، اكتسب كل شيء.',
    fr: 'La plateforme e-commerce pour les marchands algériens. Payez une fois, possédez tout.',
  },
  cta1: { ar: 'ابدأ مجاناً', fr: 'Commencer gratuitement' },
  cta2: { ar: 'شوف مثال حي', fr: 'Voir un exemple' },
}

export function HeroSection() {
  const { t } = useLang()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 bg-white overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Headline */}
        <h1 className="text-5xl lg:text-7xl font-black leading-tight text-black tracking-tight">
          {t(T.headline)}
        </h1>

        {/* Sub */}
        <p className="text-xl text-black/70 max-w-2xl leading-relaxed font-medium border-r-4 border-yellow-400 pr-4 text-right">
          {t(T.sub)}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            to="/pricing"
            className={cn(
              'px-8 py-3 font-black text-base border-2 border-black',
              'bg-yellow-400 text-black',
              'shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]',
              'hover:translate-x-[2px] hover:translate-y-[2px] transition-all'
            )}
          >
            {t(T.cta1)}
          </Link>
          <Link
            to="/demo"
            className={cn(
              'px-8 py-3 font-bold text-base border-2 border-black',
              'bg-white text-black',
              'shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000]',
              'hover:translate-x-[2px] hover:translate-y-[2px] transition-all'
            )}
          >
            {t(T.cta2)}
          </Link>
        </div>

        {/* Live store preview mockup */}
        <div className="relative mt-8 w-full max-w-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden bg-white">
          {/* Browser chrome */}
          <div className="bg-black px-4 py-2.5 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="flex-1 mx-4 bg-zinc-800 text-zinc-400 text-xs px-3 py-1 text-center font-mono">
              متجرك.7aba.store
            </span>
          </div>
          {/* Store preview */}
          <div className="relative overflow-hidden bg-white" style={{ height: '360px' }}>
            <img
              src="/demo-store-preview.png"
              alt="Store preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
