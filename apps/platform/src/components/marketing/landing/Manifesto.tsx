import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle } from '@/components/marketing/landing/primitives'
import { landingManifesto } from '@/locales'

export function Manifesto() {
  const { t } = useLang()

  return (
    <section className="manifesto section" id="idea">
      <div className="wrap">
        <Reveal>
          <Kicker>{t(landingManifesto.kicker)}</Kicker>
        </Reveal>
        <Reveal delay={60}>
          <SplitTitle
            lines={[t(landingManifesto.title.l1), t(landingManifesto.title.l2)]}
            hlIndex={1}
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="manifesto__body">{t(landingManifesto.body)}</p>
        </Reveal>
        <Reveal delay={160}>
          <div className="pillars">
            {landingManifesto.pillars.map((p, i) => (
              <div className="pillar" key={i}>
                <div className="pillar__n">{p.n}</div>
                <h3>{t(p.t)}</h3>
                <p>{t(p.d)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
