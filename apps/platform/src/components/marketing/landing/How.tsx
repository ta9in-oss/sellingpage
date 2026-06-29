import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle } from '@/components/marketing/landing/primitives'
import { landingHow } from '@/locales'

export function How() {
  const { t } = useLang()

  return (
    <section className="section" id="how">
      <div className="wrap">
        <Reveal className="shead">
          <Kicker accent>{t(landingHow.kicker)}</Kicker>
          <SplitTitle lines={[t(landingHow.title.l1), t(landingHow.title.l2)]} hlIndex={1} />
        </Reveal>
        <Reveal delay={80}>
          <div className="steps">
            {landingHow.steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="step__n">{i + 1}</div>
                <h3>{t(s.t)}</h3>
                <p>{t(s.d)}</p>
                <div className="step__arrow">→</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
