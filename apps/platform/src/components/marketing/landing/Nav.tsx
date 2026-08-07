import { useLang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { Brand } from '@/components/marketing/landing/primitives'
import { LanguageSelect } from '@/components/marketing/LanguageSelect'
import { landingNav } from '@/locales'

export function Nav() {
  const { t } = useLang()

  return (
    <header className="nav" id="top">
      <div className="wrap nav__in">
        <Brand word={t(landingNav.brand)} />
        <nav className="nav__links">
          <a href="#how">{t(landingNav.how)}</a>
          <a href="#pricing">{t(landingNav.pricing)}</a>
          <a href="https://demo.7aba.app" target="_blank" rel="noopener noreferrer">{t(landingNav.proof)}</a>
          <a href="#roadmap">{t(landingNav.roadmap)}</a>
        </nav>
        <div className="nav__right">
          <LanguageSelect variant="marketing" />
          <Link to="/auth/signin" search={{}} className="btn btn--ghost">
            {t(landingNav.login)}
          </Link>
          <Link to="/auth/signup" search={{}} className="btn btn--accent">
            {t(landingNav.cta)}
          </Link>
        </div>
      </div>
    </header>
  )
}
