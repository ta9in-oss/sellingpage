import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle, Icon } from '@/components/marketing/landing/primitives'
import { landingPricing } from '@/locales'

/* ---- types ---- */
type Tier = (typeof landingPricing.tiers)[number]

interface TierCardProps {
  tier: Tier
}

/* ---- TierCard (local) ---- */
function TierCard({ tier }: TierCardProps) {
  const { t } = useLang()
  return (
    <div className={'tier' + (tier.highlight ? ' tier--hl' : '')}>
      {tier.badge && <div className="tier__badge">{t(tier.badge)}</div>}
      <div className="tier__name">{t(tier.name)}</div>
      <div className="tier__who">{t(tier.who)}</div>
      <div className="tier__price">
        {tier.price}
        <span className="tier__cur">{t(landingPricing.currency)}</span>
      </div>
      <div className="tier__once">{t(landingPricing.once)}</div>
      <ul className="tier__feats">
        {tier.features.map((ft, i) => (
          <li key={i}>
            <span className="ck"><Icon name="check" stroke={3.4} /></span>
            {t(ft)}
          </li>
        ))}
      </ul>
      <Link
        to="/dashboard"
        search={{}}
        className={'btn ' + (tier.highlight ? 'btn--accent' : 'btn--ink')}
      >
        {t(tier.cta)}
      </Link>
    </div>
  )
}

/* ---- Pricing (exported) ---- */
export function Pricing() {
  const { t } = useLang()

  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <Reveal className="shead" style={{ maxWidth: '34em' }}>
          <Kicker>{t(landingPricing.kicker)}</Kicker>
          <SplitTitle lines={[t(landingPricing.title.l1), t(landingPricing.title.l2)]} />
          <p>{t(landingPricing.sub)}</p>
        </Reveal>

        <Reveal delay={60}>
          <div className="tiers">
            {landingPricing.tiers.map((tier, i) => (
              <TierCard key={i} tier={tier} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="ownband">
            <div className="ownband__txt">
              <h3>{t(landingPricing.ownTitle)}</h3>
              <p>{t(landingPricing.ownBody)}</p>
            </div>
            <Link to="/dashboard" search={{}} className="btn btn--ink">
              {t(landingPricing.ownCta)}<span className="btn__arrow">→</span>
            </Link>
          </div>
        </Reveal>

        <p className="pnote">{t(landingPricing.note)}</p>
      </div>
    </section>
  )
}
