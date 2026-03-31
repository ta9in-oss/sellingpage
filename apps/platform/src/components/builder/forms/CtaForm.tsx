import { useBuilderStore } from '@/hooks/useBuilderStore'
import { useLang } from '@/hooks/useLang'

const T = {
  cta: { ar: 'قسم الدعوة للعمل', fr: 'Section CTA', en: 'Call-to-Action Section' },
  headline: { ar: 'العنوان', fr: 'Titre', en: 'Headline' },
  subheadline: { ar: 'النص الفرعي', fr: 'Sous-titre', en: 'Subheadline' },
  buttonText: { ar: 'نص الزر', fr: 'Texte du bouton', en: 'Button text' },
}

export function CtaForm() {
  const { config, selectedSectionId, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const section = config.sections.find((s) => s.id === selectedSectionId)

  if (!section || section.type !== 'cta') return null

  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'
  const s = section as any
  const update = (patch: Record<string, unknown>) => updateSection(section.id, patch)
  const inputClass = 'w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900'

  return (
    <div className="space-y-4 p-4" dir={dir}>
      <h2 className="font-bold text-sm text-zinc-500 uppercase tracking-wide">{t(T.cta)}</h2>
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.headline)}</label>
        <input type="text" value={s.headline ?? ''} onChange={(e) => update({ headline: e.target.value })} className={inputClass} dir={storeDir} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.subheadline)}</label>
        <input type="text" value={s.subheadline ?? ''} onChange={(e) => update({ subheadline: e.target.value })} className={inputClass} dir={storeDir} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium">{t(T.buttonText)}</label>
        <input type="text" value={s.cta ?? ''} onChange={(e) => update({ cta: e.target.value })} className={inputClass} dir={storeDir} />
      </div>
    </div>
  )
}
