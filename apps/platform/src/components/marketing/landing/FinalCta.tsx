import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Reveal } from '@/components/marketing/landing/primitives'
import { landingFinalCta } from '@/locales'

export function FinalCta() {
  const { t } = useLang()

  return (
    <section className="section final">
      <div className="wrap">
        <Reveal>
          <div className="final__box">
            <h2>
              {t(landingFinalCta.title.l1)}
              <br />
              {t(landingFinalCta.title.l2)}
            </h2>
            <p>{t(landingFinalCta.sub)}</p>
            <Link to="/dashboard" search={{}} className="btn btn--ink btn--lg">
              {t(landingFinalCta.cta)}<span className="btn__arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
