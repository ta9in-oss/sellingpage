import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'

const ACK_KEY = 'sunset-announcement-ack'

const INK = '#1c1917'
const RUBRIC = '#8b1e1e'
const PARCHMENT = '#f5eedf'

const T = {
  summary: {
    ar: '',
    fr: 'Un mot à nos visiteurs : cette version de 7aba Store sera bientôt open source. InstantDB, la technologie sur laquelle elle repose, a été arrêtée ; merci donc de ne pas l’acheter. Nous préparons une nouvelle version, meilleure, du produit. Elle sera disponible très bientôt.',
    en: 'A note to our visitors: this version of 7aba Store is going open source soon. InstantDB, the technology it is built on, has been discontinued, so please don’t buy it. We are building a newer, better version of the product. It will be available soon.',
  },
  continue: {
    ar: 'قرأتُ البيان، تابِع إلى الموقع',
    fr: 'J’ai lu — continuer vers le site',
    en: 'I’ve read it — continue to the site',
  },
}

/** Full-screen sunset notice — the first thing every visitor sees.
 *  A plain fixed div (not a Radix Dialog) so it is in the SSR HTML and
 *  covers the page before hydration. Acknowledged once per browser session. */
export function SunsetAnnouncement() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ACK_KEY)) setOpen(false)
    } catch {}
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    buttonRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const acknowledge = () => {
    try {
      sessionStorage.setItem(ACK_KEY, '1')
    } catch {}
    setOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sunset-title"
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: PARCHMENT, color: INK }}
    >
      <article
        dir="rtl"
        lang="ar"
        className="relative max-w-2xl px-6 py-10 sm:px-14 sm:py-14"
        style={{
          fontFamily: "'Amiri', serif",
          border: `1px solid ${INK}`,
          outline: `1px solid ${INK}`,
          outlineOffset: '6px',
          margin: '1.5rem max(1rem, calc((100% - 42rem) / 2))',
        }}
      >
        <p className="text-center text-sm tracking-widest" style={{ color: RUBRIC }}>
          الجزائر، أكتوبر ٢٠٢٦
        </p>

        <h1
          id="sunset-title"
          className="mt-6 text-center text-5xl sm:text-6xl leading-tight"
          style={{ fontFamily: "'Aref Ruqaa', serif" }}
        >
          بيانٌ إلى زوّار حبّة
        </h1>

        <Ornament />

        <div
          className="space-y-6 text-[1.2rem] sm:text-[1.35rem]"
          style={{ lineHeight: 2.1, textAlign: 'justify', textJustify: 'inter-word' }}
        >
          <p>
            <span className="text-2xl font-bold" style={{ color: RUBRIC }}>أيها الزائرُ الكريم،</span>{' '}
            قِفْ قليلاً قبل أن تمضي؛ فإنّ بين يديك كلمةً لم نكتبها بالحبر وحده، ولكنّا كتبناها بالصدق الذي
            ندين به لكل من وثق بنا. إنّ هذه النسخة من «حبّة ستور» قد بلغت أجلها، لا لأنّ الفكرة شاخت، بل لأنّ
            الأساس الذي قامت عليه قد تداعى: فقد توقّفت <span dir="ltr">InstantDB</span>، وهي التقنية التي
            شيّدنا عليها البناء، والبيتُ لا يقوم على أرضٍ تنسحب من تحته.
          </p>

          <p>
            ولسنا ممّن يبيع الناسَ ما لا يضمن له غداً؛ فالتاجر الأمين لا يأخذ ثمن شيءٍ يعلم أنه زائل. لذلك
            نقولها صريحةً لا مواربة فيها:
          </p>

          <p
            className="py-2 text-center text-4xl sm:text-5xl"
            style={{ fontFamily: "'Aref Ruqaa', serif", color: RUBRIC, lineHeight: 1.6, textAlign: 'center' }}
          >
            لا تشترِ هذه النسخة
          </p>

          <p>
            ولكنّا لن ندعها تذهب هباءً. سنُطلق شيفرتها مفتوحةَ المصدر للناس جميعاً، يقرؤها المتعلّم فيتعلّم،
            ويبني عليها الصانع فيصنع، ويأخذ منها كلُّ من شاء ما شاء؛ فإنّ العلم إذا حُبس فسد، وإذا بُذل نما
            وزكا.
          </p>

          <p>
            وأمّا نحن، فقد شمّرنا عن سواعدنا لنسخةٍ جديدة، أمتنَ أساساً، وأبعدَ نظراً، وأوفى بحاجة التاجر
            الجزائري الذي آمنّا به منذ اليوم الأول. وما هي إلا أيامٌ حتى ترى النور، فانتظرنا؛ فإنّ الحبّة إذا
            دُفنت في التراب لم تمت، وإنما تتهيّأ لتصير سنبلة.
          </p>
        </div>

        <Ornament />

        <p className="text-left text-3xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          فريق حبّة
          <span className="mt-2 block text-lg" style={{ fontFamily: "'Amiri', serif" }}>
            ومن ورائها{' '}
            <a
              href="https://ta9in.com"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-4 hover:opacity-70"
              style={{ color: RUBRIC }}
            >
              تقن
            </a>
          </span>
        </p>

        {lang !== 'ar' && (
          <p
            dir="ltr"
            lang={lang}
            className="mt-8 border-t pt-6 text-base italic leading-relaxed"
            style={{ borderColor: `${INK}33`, textAlign: 'left' }}
          >
            {t(T.summary)}
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            ref={buttonRef}
            onClick={acknowledge}
            size="lg"
            className="cursor-pointer rounded-none px-8 py-6 text-lg transition-opacity hover:opacity-85"
            style={{ background: INK, color: PARCHMENT, fontFamily: lang === 'ar' ? "'Amiri', serif" : undefined }}
          >
            {t(T.continue)}
          </Button>
        </div>
      </article>
    </div>
  )
}

function Ornament() {
  return (
    <div aria-hidden className="my-8 flex items-center justify-center gap-4" style={{ color: RUBRIC }}>
      <span className="h-px w-16 sm:w-24" style={{ background: 'currentColor' }} />
      <span className="text-2xl leading-none">۞</span>
      <span className="h-px w-16 sm:w-24" style={{ background: 'currentColor' }} />
    </div>
  )
}
