import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Brand } from '@/components/marketing/landing/primitives'
import { landingNav, landingFooter } from '@/locales'

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div>
            <Brand light word={t(landingNav.brand)} />
            <p className="foot__tag">{t(landingFooter.tagline)}</p>
          </div>
          <nav className="foot__links">
            <a href="#how">{t(landingNav.how)}</a>
            <a href="#pricing">{t(landingNav.pricing)}</a>
            <a href="#proof">{t(landingNav.proof)}</a>
            <a href="#roadmap">{t(landingNav.roadmap)}</a>
            <Link to="/dashboard" search={{}}>{t(landingNav.cta)}</Link>
          </nav>
        </div>
        <div className="foot__bot">
          <span>
            {t(landingFooter.built)}{' '}
            <a href="https://ta9in.com" target="_blank" rel="noopener">ta9in.com</a>
          </span>
          <span>{t(landingFooter.rights)}</span>
        </div>
      </div>
    </footer>
  )
}
