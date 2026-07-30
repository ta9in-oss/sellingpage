import { Link } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle, Icon } from '@/components/marketing/landing/primitives'
import { FirstBatchCountdown } from '@/components/marketing/FirstBatchCountdown'
import { contactWhatsappUrl } from '@/config/pricing'
import { landingPricing } from '@/locales'

/* ---- types ---- */
// The tiers array is a heterogeneous union; intersecting with the optional extras
// makes badge/after/contact safely accessible on every card.
type Tier = (typeof landingPricing.tiers)[number] & {
  badge?: { ar: string; en: string }
  after?: { ar: string; en: string }
  contact?: boolean
}

const RUN_ONE_MSG = {
  ar: 'مرحباً، أنا مهتم بباقة Run One على 7aba.',
  en: 'Hi, I am interested in the Run One plan on 7aba.',
}

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
      {tier.after && (
        <div
          className="tier__after"
          style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 800, marginTop: '0.1rem' }}
        >
          {t(tier.after)}
        </div>
      )}
      <ul className="tier__feats">
        {tier.features.map((ft, i) => (
          <li key={i}>
            <span className="ck"><Icon name="check" stroke={3.4} /></span>
            {t(ft)}
          </li>
        ))}
      </ul>
      {tier.contact ? (
        <a
          href={contactWhatsappUrl(t(RUN_ONE_MSG))}
          target="_blank"
          rel="noopener noreferrer"
          className={'btn ' + (tier.highlight ? 'btn--accent' : 'btn--ink')}
        >
          {t(tier.cta)}
        </a>
      ) : (
        <Link
          to="/dashboard"
          search={{}}
          className={'btn ' + (tier.highlight ? 'btn--accent' : 'btn--ink')}
        >
          {t(tier.cta)}
        </Link>
      )}
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

        <Reveal delay={40}>
          <div style={{ margin: '-0.75rem auto 0.5rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FirstBatchCountdown variant="light" />
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="tiers">
            {(landingPricing.tiers as Tier[]).map((tier, i) => (
              <TierCard key={i} tier={tier} />
            ))}
          </div>
        </Reveal>

        <p className="pnote">{t(landingPricing.note)}</p>
      </div>
    </section>
  )
}
