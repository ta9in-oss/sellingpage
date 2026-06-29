import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle, Icon, FEATURE_ICONS } from '@/components/marketing/landing/primitives'
import { landingFeatures } from '@/locales'

export function Features() {
  const { t } = useLang()

  return (
    <section className="section section--tight">
      <div className="wrap">
        <Reveal className="shead">
          <Kicker>{t(landingFeatures.kicker)}</Kicker>
          <SplitTitle lines={[t(landingFeatures.title.l1), t(landingFeatures.title.l2)]} hlIndex={1} />
        </Reveal>
        <div className="fgrid">
          {landingFeatures.items.map((it, i) => (
            <Reveal key={i} delay={i * 50} className="fcard">
              <div className="ficon"><Icon name={FEATURE_ICONS[i]} /></div>
              <h3>{t(it.t)}</h3>
              <p>{t(it.d)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
