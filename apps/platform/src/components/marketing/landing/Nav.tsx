import { useLang } from '@/hooks/useLang'
import type { Lang } from '@/hooks/useLang'
import { Link } from '@tanstack/react-router'
import { Brand } from '@/components/marketing/landing/primitives'
import { landingNav } from '@/locales'

export function Nav() {
  const { lang, setLang, t } = useLang()

  return (
    <header className="nav" id="top">
      <div className="wrap nav__in">
        <Brand word={t(landingNav.brand)} />
        <nav className="nav__links">
          <a href="#how">{t(landingNav.how)}</a>
          <a href="#pricing">{t(landingNav.pricing)}</a>
          <a href="#proof">{t(landingNav.proof)}</a>
          <a href="#roadmap">{t(landingNav.roadmap)}</a>
        </nav>
        <div className="nav__right">
          <select
            className="langbtn"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label="switch language"
          >
            <option value="ar">عربي</option>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
          <Link to="/dashboard" search={{}} className="btn btn--accent">
            {t(landingNav.cta)}
          </Link>
        </div>
      </div>
    </header>
  )
}
