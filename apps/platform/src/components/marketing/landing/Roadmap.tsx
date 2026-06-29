import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle } from '@/components/marketing/landing/primitives'
import { landingRoadmap } from '@/locales'

export function Roadmap() {
  const { t } = useLang()

  return (
    <section className="roadmap section" id="roadmap">
      <div className="wrap">
        <Reveal className="shead">
          <Kicker accent>{t(landingRoadmap.kicker)}</Kicker>
          <SplitTitle lines={[t(landingRoadmap.title.l1), t(landingRoadmap.title.l2)]} hlIndex={1} />
          <p>{t(landingRoadmap.sub)}</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="rcols">
            {landingRoadmap.cols.map((c, i) => (
              <div className="rcol" key={i}>
                <span className="rcol__tag">{t(c.tag)}</span>
                <ul>
                  {c.items.map((it, j) => (
                    <li key={j}>{t(it)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
