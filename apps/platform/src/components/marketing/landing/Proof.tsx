import { useEffect, useRef } from 'react'
import { useLang } from '@/hooks/useLang'
import { Reveal, Kicker, SplitTitle } from '@/components/marketing/landing/primitives'
import { landingProof } from '@/locales'

export function Proof() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const storeImg = useRef<HTMLImageElement>(null)
  const dashImg = useRef<HTMLImageElement>(null)

  // As the section scrolls through the viewport, the two window screenshots
  // auto-scroll their tall images (translateY) so the visitor sees the whole
  // store + dashboard without a manual scrollbar — reveal-on-scroll.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      for (const ref of [storeImg, dashImg]) {
        const im = ref.current
        const frame = im?.parentElement
        if (!im || !frame) continue
        const scrollable = Math.max(0, im.scrollHeight - frame.clientHeight)
        im.style.transform = `translateY(${-p * scrollable}px)`
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="section" id="proof" ref={sectionRef}>
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
              <img ref={storeImg} src="/landing/store.png" alt={t(landingProof.cap1)} />
            </div>
            <div className="shot__label">
              <b>{t(landingProof.cap1)}</b>
              <span>{t(landingProof.cap1sub)}</span>
            </div>
          </div>
          <div className="shot shot--b">
            <div className="shot__frame">
              <img ref={dashImg} src="/landing/dashboard.png" alt={t(landingProof.cap2)} />
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
