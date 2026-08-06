import { useMemo, useState } from 'react'
import { Award, Download, Loader2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import type { Lang } from '@/hooks/useLang'

/**
 * The founding-believer certificate. Purely a client-side render of the
 * durable `founderCode` the server minted at purchase — it invents no data.
 *
 * We draw the certificate as a self-contained SVG (crisp at any size, no fonts
 * to embed, no libraries) and rasterize it to a 2× PNG on download. The same
 * SVG is shown inline as the preview so what you see is what you save.
 */

type Props = {
  founderCode: string
  tier: string
  email: string
  batch?: string
  purchasedAt?: number
}

const TIER_NAME: Record<string, string> = {
  starter: 'Starter',
  pro: 'Freelancer',
  agency: 'Run One',
}

const STR: Record<Lang, Record<string, string>> = {
  ar: {
    title: 'شهادة العضو المؤسس',
    awarded: 'تُمنح هذه الشهادة إلى',
    because: 'لأنّك آمنت بهذا المشروع منذ البداية',
    codeLabel: 'رمز العضو المؤسس',
    perks: 'يمنحك امتيازات في منتجات ta9in القادمة: تخفيضات، أولوية الدخول، ورصيد دعوات',
    footnote: 'امتيازات تقديرية غير مُلزِمة، قابلة للتغيير.',
    team: 'فريق ta9in',
    batch: 'الدفعة الأولى',
    plan: 'الباقة',
    date: 'التاريخ',
    cardTitle: 'أنت عضو مؤسس',
    cardBody: 'شكراً لثقتك المبكرة. هذه شهادتك برمزٍ خاص لامتيازات منتجات ta9in القادمة.',
    download: 'تحميل الشهادة',
  },
  fr: {
    title: 'Certificat de Membre Fondateur',
    awarded: 'Décerné à',
    because: 'Pour avoir cru en ce projet dès le premier jour',
    codeLabel: 'Code Membre Fondateur',
    perks: 'Débloque des avantages sur les futurs produits ta9in : réductions, accès prioritaire et crédits d’invitation',
    footnote: 'Avantages discrétionnaires, non contractuels, susceptibles d’évoluer.',
    team: 'L’équipe ta9in',
    batch: 'Première Vague',
    plan: 'Forfait',
    date: 'Date',
    cardTitle: 'Vous êtes un Membre Fondateur',
    cardBody: 'Merci de votre confiance précoce. Voici votre certificat avec un code pour les avantages des futurs produits ta9in.',
    download: 'Télécharger le certificat',
  },
  en: {
    title: 'Founding Believer Certificate',
    awarded: 'Awarded to',
    because: 'For believing in this project from day one',
    codeLabel: 'Founding Member Code',
    perks: 'Unlocks perks on future ta9in products: reductions, early access, and invite credits',
    footnote: 'Discretionary, non-binding perks, subject to change.',
    team: 'The ta9in team',
    batch: 'First Batch',
    plan: 'Plan',
    date: 'Date',
    cardTitle: 'You are a Founding Believer',
    cardBody: 'Thank you for backing us early. Here is your certificate with a code for perks on future ta9in products.',
    download: 'Download certificate',
  },
}

const W = 1200
const H = 848
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Plan / batch / date, as three centered cells inside a bordered panel that
 * shares the code block's 600px width.
 *
 * Every label and value is `text-anchor="middle"` on purpose. The previous
 * layout anchored to the certificate edges with `start`/`end`, which breaks in
 * Arabic: `direction="rtl"` makes a `start`-anchored run grow leftward, so the
 * plan line walked off the page. A middle anchor is direction-agnostic — only
 * the *order* of the cells has to mirror, which is what `rtl` flips here.
 */
function footerPanel(
  s: Record<string, string>,
  planName: string,
  batch: string,
  date: string,
  rtl: boolean,
  dirAttr: string,
): string {
  const cx = W / 2
  const top = 694
  const height = 58
  const cells: Array<{ label: string; value: string }> = [
    { label: s.plan, value: planName },
    { label: s.batch, value: batch },
    { label: s.date, value: date },
  ]
  if (rtl) cells.reverse()

  const offsets = [-200, 0, 200]
  const body = cells
    .map((cell, i) => {
      const x = cx + offsets[i]
      // Values are Latin (plan name, batch number, DD/MM/YYYY) — no rtl attr on
      // them, or the slashes in the date get reordered.
      return `  <text x="${x}" y="${top + 20}" text-anchor="middle" font-size="12" letter-spacing="2" fill="#999999"${dirAttr}>${esc(cell.label)}</text>
  <text x="${x}" y="${top + 44}" text-anchor="middle" font-size="17" fill="#111111" font-weight="700">${esc(cell.value)}</text>`
    })
    .join('\n')

  const dividers = [-100, 100]
    .map(
      (dx) =>
        `  <line x1="${cx + dx}" y1="${top + 12}" x2="${cx + dx}" y2="${top + height - 12}" stroke="#C9A24B" stroke-width="1" opacity="0.5"/>`,
    )
    .join('\n')

  return `<rect x="${cx - 300}" y="${top}" width="600" height="${height}" rx="10" fill="none" stroke="#C9A24B" stroke-width="1.5" opacity="0.8"/>
${dividers}
${body}`
}

function buildSvg(lang: Lang, p: Props): string {
  const s = STR[lang]
  const rtl = lang === 'ar'
  const anchor = 'middle'
  // DD/MM/YYYY in Latin digits, in every language. A certificate is a record:
  // it must read the same to whoever holds it, and it has to fit a fixed-width
  // SVG cell — locale month names and Arabic-Indic digits do neither.
  const d = new Date(p.purchasedAt ?? Date.now())
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
  const planName = TIER_NAME[p.tier] ?? p.tier
  const dirAttr = rtl ? ' direction="rtl"' : ''
  const cx = W / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Segoe UI', 'Noto Sans Arabic', system-ui, sans-serif">
  <rect width="${W}" height="${H}" fill="#FAF6EC"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#111111" stroke-width="3"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#C9A24B" stroke-width="1.5"/>

  <text x="${cx}" y="118" text-anchor="${anchor}" font-size="20" letter-spacing="6" fill="#C9A24B" font-weight="700">ta9in · 7aba.app</text>
  <text x="${cx}" y="185" text-anchor="${anchor}" font-size="46" fill="#111111" font-weight="800"${dirAttr}>${esc(s.title)}</text>
  <line x1="${cx - 90}" y1="215" x2="${cx + 90}" y2="215" stroke="#C9A24B" stroke-width="2"/>

  <text x="${cx}" y="285" text-anchor="${anchor}" font-size="22" fill="#555555"${dirAttr}>${esc(s.awarded)}</text>
  <text x="${cx}" y="340" text-anchor="${anchor}" font-size="36" fill="#111111" font-weight="700">${esc(p.email)}</text>
  <text x="${cx}" y="392" text-anchor="${anchor}" font-size="21" fill="#555555"${dirAttr}>${esc(s.because)}</text>

  <rect x="${cx - 300}" y="440" width="600" height="118" rx="12" fill="#111111"/>
  <text x="${cx}" y="480" text-anchor="${anchor}" font-size="15" letter-spacing="3" fill="#C9A24B" font-weight="700"${dirAttr}>${esc(s.codeLabel)}</text>
  <text x="${cx}" y="530" text-anchor="${anchor}" font-size="40" fill="#FAF6EC" font-weight="800" letter-spacing="4" font-family="'Courier New', monospace">${esc(p.founderCode)}</text>

  <text x="${cx}" y="612" text-anchor="${anchor}" font-size="19" fill="#333333"${dirAttr}>${esc(s.perks)}</text>
  <text x="${cx}" y="646" text-anchor="${anchor}" font-size="14" fill="#999999"${dirAttr}>${esc(s.footnote)}</text>

  ${footerPanel(s, planName, p.batch ?? '1', date, rtl, dirAttr)}
  <text x="${cx}" y="794" text-anchor="${anchor}" font-size="18" fill="#111111" font-weight="700"${dirAttr}>${esc(s.team)}</text>
</svg>`
}

export function FounderCertificate(props: Props) {
  const { lang, dir } = useLang()
  const s = STR[lang]
  const [busy, setBusy] = useState(false)

  const svg = useMemo(() => buildSvg(lang, props), [lang, props])
  const svgUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    [svg],
  )

  const download = async () => {
    setBusy(true)
    try {
      const scale = 2
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('svg load failed'))
        img.src = svgUrl
      })
      const canvas = document.createElement('canvas')
      canvas.width = W * scale
      canvas.height = H * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const blob: Blob = await new Promise((res) =>
        canvas.toBlob((b) => res(b!), 'image/png'),
      )
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `ta9in-founder-${props.founderCode}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      dir={dir}
      className="rounded-2xl border border-[#C9A24B]/40 bg-gradient-to-br from-[#FAF6EC] to-[#F3ECD8] p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="w-11 h-11 rounded-xl bg-[#111] flex items-center justify-center shrink-0">
          <Award className="h-5 w-5 text-[#C9A24B]" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-black text-[#111]">{s.cardTitle}</p>
          <p className="text-sm text-[#555]">{s.cardBody}</p>
          <p className="text-sm font-mono font-bold text-[#111] pt-1">{props.founderCode}</p>
        </div>
        <button
          onClick={download}
          disabled={busy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-[#FAF6EC] text-sm font-semibold hover:bg-[#111]/90 transition-colors shrink-0 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {s.download}
        </button>
      </div>

      <img
        src={svgUrl}
        alt="certificate preview"
        className="mt-5 w-full rounded-lg border border-[#C9A24B]/30 shadow-sm"
      />
    </div>
  )
}
