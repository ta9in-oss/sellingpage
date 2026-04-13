import { useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { validateSlug } from '@/lib/slugValidation'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'

interface Props {
  storeId: string
  onContinue: () => void
}

const T = {
  storeName: { ar: 'اسم المتجر', fr: 'Nom de la boutique', en: 'Store name' },
  storeSlug: { ar: 'رابط المتجر', fr: 'Lien de la boutique', en: 'Store slug' },
  nameTaken: { ar: 'هذا الاسم مستخدم', fr: 'Ce nom est pris', en: 'This name is taken' },
  nameAvailable: { ar: '✓ الاسم متاح', fr: '✓ Nom disponible', en: '✓ Name available' },
  themeColors: { ar: 'ألوان الثيم', fr: 'Couleurs du thème', en: 'Theme colors' },
  pageSections: { ar: 'أقسام الصفحة', fr: 'Sections de la page', en: 'Page sections' },
  noSections: { ar: 'لا توجد أقسام محددة', fr: 'Aucune section définie', en: 'No sections defined' },
  looksGood: { ar: 'يبدو جيداً، تابع', fr: 'Tout est bon, continuer', en: 'Looks good, continue' },
  sectionHero: { ar: 'القسم الرئيسي', fr: 'Section héros', en: 'Hero section' },
  sectionFeatures: { ar: 'المميزات', fr: 'Fonctionnalités', en: 'Features' },
  sectionTestimonials: { ar: 'آراء العملاء', fr: 'Avis clients', en: 'Testimonials' },
  sectionFaq: { ar: 'الأسئلة الشائعة', fr: 'FAQ', en: 'FAQ' },
  sectionGuarantee: { ar: 'ضمان المنتج', fr: 'Garantie produit', en: 'Product guarantee' },
  sectionOrderForm: { ar: 'نموذج الطلب', fr: 'Formulaire de commande', en: 'Order form' },
}

export function ReviewStep({ storeId, onContinue }: Props) {
  const { t } = useLang()
  const config = useBuilderStore((s) => s.config)
  const updateMeta = useBuilderStore((s) => s.updateMeta)
  const [slug, setSlug] = useState(config.meta.slug)

  const SECTION_LABELS: Record<string, string> = {
    hero: t(T.sectionHero),
    features: t(T.sectionFeatures),
    testimonials: t(T.sectionTestimonials),
    faq: t(T.sectionFaq),
    guarantee: t(T.sectionGuarantee),
    'order-form': t(T.sectionOrderForm),
  }

  const validation = validateSlug(slug)
  // Use a sentinel value so the query is always called (hooks rule compliance)
  const slugToQuery = validation.valid ? slug : '__no_match_8xk2__'

  const { data: slugCheckData } = db.useQuery({
    stores: { $: { where: { slug: slugToQuery } } },
  })

  const matchingStores = slugCheckData?.stores ?? []
  const isTaken = matchingStores.length > 0 && matchingStores.every((s) => s.id !== storeId)
  const isValid = validation.valid && !isTaken

  const swatchColors = [
    config.theme.colors.primary,
    config.theme.colors.secondary,
    config.theme.colors.accent,
    config.theme.colors.background,
  ]

  const handleContinue = () => {
    updateMeta({ slug })
    onContinue()
  }

  return (
    <div className="space-y-6">
      {/* Store name (read-only) */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{t(T.storeName)}</p>
        <div className="px-3 py-2.5 bg-muted rounded-lg text-sm font-medium">
          {config.meta.name || '-'}
        </div>
      </div>

      {/* Slug input */}
      <div>
        <p className="text-sm font-medium mb-1.5">{t(T.storeSlug)}</p>
        <div className="flex items-center gap-2" dir="ltr">
          <span className="text-sm text-muted-foreground shrink-0 select-none">7aba.store/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
            className={cn(
              'flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors',
              !isValid && slug.length > 0
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-border focus:ring-ring/30'
            )}
            placeholder="my-store"
            dir="ltr"
          />
        </div>
        {validation.error && slug.length > 0 && (
          <p className="text-destructive text-xs mt-1.5">{validation.error}</p>
        )}
        {!validation.error && isTaken && (
          <p className="text-destructive text-xs mt-1.5">{t(T.nameTaken)}</p>
        )}
        {isValid && slug.length > 0 && (
          <p className="text-green-600 text-xs mt-1.5">{t(T.nameAvailable)}</p>
        )}
      </div>

      {/* Theme color swatches */}
      <div>
        <p className="text-sm font-medium mb-2">{t(T.themeColors)}</p>
        <div className="flex gap-2">
          {swatchColors.map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-md border border-border shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Section list (read-only) */}
      <div>
        <p className="text-sm font-medium mb-2">{t(T.pageSections)}</p>
        {config.sections.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t(T.noSections)}</p>
        ) : (
          <ul className="space-y-1.5">
            {config.sections.map((section) => (
              <li
                key={section.id}
                className="flex items-center gap-2 text-sm px-3 py-2 bg-muted rounded-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {SECTION_LABELS[section.type] ?? section.type}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={cn(
          'w-full py-3 rounded-lg font-semibold text-sm transition-colors',
          isValid
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {t(T.looksGood)}
      </button>
    </div>
  )
}
