import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle } from '@/components/marketing/landing/primitives'
import { landingProof } from '@/locales'

export function Proof() {
  const { t } = useLang()

  return (
    <section className="section" id="proof">
      <div className="wrap">
        <Reveal className="shead">
          <Kicker accent>{t(landingProof.kicker)}</Kicker>
          <SplitTitle lines={[t(landingProof.title.l1), t(landingProof.title.l2)]} hlIndex={1} />
          <p>{t(landingProof.body)}</p>
        </Reveal>
        <Reveal delay={80} className="proof__shots">
          <div className="shot">
            <span className="tape">7aba</span>
            <div className="shot__frame">
              <img src="/landing/store.png" alt={t(landingProof.cap1)} />
            </div>
            <div className="shot__label">
              <b>{t(landingProof.cap1)}</b>
              <span>{t(landingProof.cap1sub)}</span>
            </div>
          </div>
          <div className="shot shot--b">
            <div className="shot__frame">
              <img src="/landing/dashboard.png" alt={t(landingProof.cap2)} />
            </div>
            <div className="shot__label">
              <b>{t(landingProof.cap2)}</b>
              <span>{t(landingProof.cap2sub)}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
