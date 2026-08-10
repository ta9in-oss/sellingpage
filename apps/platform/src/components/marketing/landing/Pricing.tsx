import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle, Icon } from '@/components/marketing/landing/primitives'
import { FirstBatchCountdown } from '@/components/marketing/FirstBatchCountdown'
import { OnlineIndicator } from '@/components/marketing/OnlineIndicator'
import { contactWhatsappUrl, STARTER_NORMAL_DZD, FLEXY_LABEL } from '@/config/pricing'
import { getStarterPriceVariant } from '@/lib/starterPriceVariant'
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
  /** Only set for the starter card — overrides the static fallback price with the visitor's assigned A/B variant. */
  priceOverride?: number
}

/* ---- TierCard (local) ---- */
function TierCard({ tier, priceOverride }: TierCardProps) {
  const { t } = useLang()
  const price = priceOverride != null ? priceOverride.toLocaleString('en-US') : tier.price
  const normalPrice = priceOverride != null ? STARTER_NORMAL_DZD.toLocaleString('en-US') : tier.normalPrice
  return (
    <div className={'tier' + (tier.highlight ? ' tier--hl' : '')}>
      {tier.badge && <div className="tier__badge">{t(tier.badge)}</div>}
      <div className="tier__name">{t(tier.name)}</div>
      <div className="tier__who">{t(tier.who)}</div>
      {normalPrice && (
        <div
          className="tier__normal"
          style={{ textDecoration: 'line-through', opacity: 0.45, fontWeight: 700, fontSize: '0.95rem', marginBottom: '-0.1rem' }}
        >
          {normalPrice} {t(landingPricing.currency)}
        </div>
      )}
      <div className="tier__price">
        {price}
        <span className="tier__cur">{t(landingPricing.currency)}</span>
      </div>
      {priceOverride != null && (
        <div className="tier__flexy" style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '-0.2rem' }}>
          {FLEXY_LABEL}
        </div>
      )}
      <div className="tier__once">{t(landingPricing.once)}</div>
      {tier.after && (
        <div
          className="tier__after"
          style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 800, marginTop: '-0.15rem' }}
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
          to="/auth/signup"
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
  // Starts at the static fallback (2000, the majority variant) for SSR/first
  // paint, then swaps to the visitor's persisted variant once localStorage is
  // readable — avoids a hydration mismatch while still showing the real
  // assigned price almost immediately.
  const [starterPrice, setStarterPrice] = useState<number | undefined>(undefined)
  useEffect(() => {
    setStarterPrice(getStarterPriceVariant())
  }, [])

  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <OnlineIndicator />
        </div>
        <Reveal className="shead" style={{ maxWidth: '34em' }}>
          <Kicker>{t(landingPricing.kicker)}</Kicker>
          <SplitTitle lines={[t(landingPricing.title.l1), t(landingPricing.title.l2)]} />
          <p>{t(landingPricing.sub)}</p>
        </Reveal>

        <Reveal delay={40}>
          <div style={{ margin: '-0.75rem auto 2.75rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FirstBatchCountdown variant="light" />
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="tiers">
            {(landingPricing.tiers as Tier[]).map((tier, i) => (
              <TierCard key={i} tier={tier} priceOverride={i === 0 ? starterPrice : undefined} />
            ))}
          </div>
        </Reveal>

        <p className="pnote">{t(landingPricing.note)}</p>
      </div>
    </section>
  )
}
