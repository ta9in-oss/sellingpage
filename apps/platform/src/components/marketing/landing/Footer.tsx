import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Brand } from '@/components/marketing/landing/primitives'
import { landingNav, landingFooter } from '@/locales'
import { contactWhatsappUrl } from '@/config/pricing'

const CONTACT_MSG = {
  ar: 'مرحباً، لدي سؤال بخصوص 7aba.',
  fr: "Bonjour, j'ai une question sur 7aba.",
  en: 'Hi, I have a question about 7aba.',
}
const CONTACT_LABEL = { ar: 'تواصل معنا', fr: 'Contactez-nous', en: 'Contact us' }

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
            <a href="https://demo.7aba.app" target="_blank" rel="noopener noreferrer">{t(landingNav.proof)}</a>
            <a href="#roadmap">{t(landingNav.roadmap)}</a>
            <a href={contactWhatsappUrl(t(CONTACT_MSG))} target="_blank" rel="noopener noreferrer">{t(CONTACT_LABEL)}</a>
            <Link to="/auth/signup" search={{}}>{t(landingNav.cta)}</Link>
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
