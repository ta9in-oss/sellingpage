import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/marketing/landing/primitives'
import { landingHero } from '@/locales'

export function Hero() {
  const { t } = useLang()

  return (
    <section className="hero">
      <div className="wrap hero__grid">
        <div>
          <Reveal tag="div">
            <span className="hero__eyebrow">{t(landingHero.eyebrow)}</span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display">
              <span className="l1">{t(landingHero.headline.l1)}</span>
              <span className="l2"><span className="hl">{t(landingHero.headline.l2)}</span></span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="hero__sub">{t(landingHero.sub)}</p>
          </Reveal>
          <Reveal delay={180}>
            <div className="hero__cta">
              <Link to="/auth/signup" search={{}} className="btn btn--accent btn--lg">
                {t(landingHero.ctaPrimary)}<span className="btn__arrow">→</span>
              </Link>
              <a className="btn btn--lg" href="https://demo.7aba.app" target="_blank" rel="noopener noreferrer">{t(landingHero.ctaSecondary)}</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140} className="frame">
          <div className="float float--price">{t(landingHero.price)}</div>
          <div className="float float--ship">{t(landingHero.delivery)}</div>
          <div className="frame__win">
            <div className="frame__bar">
              <div className="frame__dots">
                <i style={{ background: '#ff5f57' }}></i>
                <i style={{ background: '#febc2e' }}></i>
                <i style={{ background: '#28c840' }}></i>
              </div>
              <div className="frame__url">{t(landingHero.frameTitle)}</div>
            </div>
            <div className="frame__shot">
              <img src="/landing/store.png" alt="live 7aba store" />
            </div>
          </div>
          <div className="float float--notif">
            <span className="cart">🛒</span>
            <span>
              <b>{t(landingHero.notif)}</b>
              <small>{t(landingHero.notifAgo)}</small>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
