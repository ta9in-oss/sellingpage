/**
 * StoreCreationWizard — 2-step full-page wizard for creating a new store.
 *
 * Step 1: Store info  — name, identifier, locale, SEO title/description
 * Step 2: Product     — name, price, currency, images
 *
 * On finish: creates a valid StoreConfig in InstantDB then navigates to the builder.
 * On cancel: calls onCancel (typically navigates back to /dashboard).
 */
import { useState, useCallback } from 'react'
import { db } from '@/lib/instantdb'
import { id } from '@instantdb/react'
import { nanoid } from 'nanoid'
import { useNavigate } from '@tanstack/react-router'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { ImageUpload } from './ImageUpload'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Loader2, Plus, X, ArrowRight, ArrowLeft, Store, Package } from 'lucide-react'
import type { StoreConfig } from '@7aba/store-ui'

export interface StoreCreationWizardProps {
  userEmail: string
  onCancel: () => void
}

type Step = 1 | 2

const T = {
  // Wizard shell
  createStore: { ar: 'إنشاء متجر جديد', fr: 'Créer une boutique', en: 'Create new store' },
  step1Label: { ar: 'معلومات المتجر', fr: 'Infos boutique', en: 'Store info' },
  step2Label: { ar: 'المنتج', fr: 'Produit', en: 'Product' },
  next: { ar: 'التالي', fr: 'Suivant', en: 'Next' },
  back: { ar: 'رجوع', fr: 'Retour', en: 'Back' },
  backToDashboard: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
  creating: { ar: 'جارٍ الإنشاء...', fr: 'Création...', en: 'Creating...' },
  createAndOpen: { ar: 'إنشاء وفتح المبني', fr: 'Créer et ouvrir', en: 'Create & Open Builder' },
  // Step 1
  storeName: { ar: 'اسم المتجر *', fr: 'Nom de la boutique *', en: 'Store name *' },
  storeNamePlaceholder: { ar: 'مثال: متجر كيكة أمي', fr: 'Ex: Boutique Kakua', en: 'Ex: My Awesome Store' },
  slugLabel: { ar: 'معرف المتجر', fr: 'Identifiant', en: 'Store identifier' },
  slugHint: { ar: 'حروف إنجليزية وأرقام وشرطات فقط', fr: 'Lettres, chiffres et tirets uniquement', en: 'Lowercase letters, numbers and hyphens only' },
  locale: { ar: 'لغة المتجر', fr: 'Langue', en: 'Store language' },
  seoTitle: { ar: 'عنوان المتصفح (SEO)', fr: 'Titre du navigateur (SEO)', en: 'Browser title (SEO)' },
  seoTitleHint: { ar: 'يظهر في تاب المتصفح ونتائج Google', fr: "Affiché dans l'onglet et Google", en: 'Shown in browser tab and Google results' },
  seoDesc: { ar: 'وصف الموقع (SEO)', fr: 'Description (SEO)', en: 'Site description (SEO)' },
  seoDescHint: { ar: '130-160 حرف للحصول على أفضل ظهور في Google', fr: '130-160 caractères pour le meilleur référencement', en: '130-160 chars for best Google display' },
  // Step 2
  productName: { ar: 'اسم المنتج *', fr: 'Nom du produit *', en: 'Product name *' },
  productNamePlaceholder: { ar: 'مثال: حقيبة ظهر للمدرسة', fr: 'Ex: Sac à dos scolaire', en: 'Ex: School backpack' },
  price: { ar: 'السعر *', fr: 'Prix *', en: 'Price *' },
  currency: { ar: 'العملة', fr: 'Devise', en: 'Currency' },
  productImages: { ar: 'صور المنتج', fr: 'Images du produit', en: 'Product images' },
  addImage: { ar: 'إضافة صورة', fr: 'Ajouter une image', en: 'Add image' },
  imageHint: { ar: 'أضف حتى 5 صور للمنتج، تظهر في الكاروسيل', fr: "Ajoutez jusqu'à 5 images, affichées dans le carrousel", en: 'Add up to 5 product images, shown in carousel' },
  removeImage: { ar: 'حذف', fr: 'Supprimer', en: 'Remove' },
  // Validation
  nameRequired: { ar: 'اسم المتجر مطلوب', fr: 'Le nom est requis', en: 'Store name is required' },
  productNameRequired: { ar: 'اسم المنتج مطلوب', fr: 'Le nom du produit est requis', en: 'Product name is required' },
  priceInvalid: { ar: 'أدخل سعراً صحيحاً', fr: 'Prix invalide', en: 'Enter a valid price' },
  error: { ar: 'حدث خطأ. حاول مجدداً.', fr: 'Une erreur est survenue.', en: 'An error occurred. Try again.' },
}

function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[\u0600-\u06FF]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'store-' + nanoid(6).toLowerCase()
  )
}

export function StoreCreationWizard({ userEmail, onCancel }: StoreCreationWizardProps) {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const isRtl = dir === 'rtl'

  const [step, setStep] = useState<Step>(1)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1 state
  const [storeName, setStoreName] = useState('')
  const [slug, setSlug] = useState('')
  const [locale, setLocale] = useState<'ar' | 'fr' | 'en'>('ar')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  // Step 2 state
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<'DZD' | 'USD'>('DZD')
  const [images, setImages] = useState<string[]>([])

  const handleNameChange = useCallback((name: string) => {
    setStoreName(name)
    if (!slugTouched) {
      setSlug(generateSlug(name))
    }
  }, [slugTouched])

  const handleSlugChange = useCallback((val: string) => {
    setSlugTouched(true)
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40))
  }, [])

  const validateStep1 = (): string | null => {
    if (!storeName.trim()) return t(T.nameRequired)
    return null
  }

  const validateStep2 = (): string | null => {
    if (!productName.trim()) return t(T.productNameRequired)
    if (!price || isNaN(Number(price)) || Number(price) < 0) return t(T.priceInvalid)
    return null
  }

  const goToStep2 = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError(null)
    setStep(2)
  }

  const handleCreate = async () => {
    const err = validateStep2()
    if (err) { setError(err); return }
    setError(null)
    setCreating(true)
    try {
      const storeId = id()
      const finalSlug = slug.trim() || generateSlug(storeName)
      const baseConfig = useBuilderStore.getState().config

      const config: StoreConfig = {
        ...baseConfig,
        meta: {
          ...baseConfig.meta,
          name: storeName.trim(),
          slug: finalSlug,
          locale,
          rtl: locale === 'ar',
          ...(seoTitle.trim() ? { siteTitle: seoTitle.trim() } : {}),
          ...(seoDesc.trim() ? { siteDescription: seoDesc.trim() } : {}),
        },
        product: {
          name: productName.trim(),
          price: Number(price),
          currency,
          images,
        },
        sections: baseConfig.sections.map((s) =>
          s.type === 'hero'
            ? { ...s, headline: productName.trim() || s.headline }
            : s.type === 'footer'
            ? { ...s, storeName: storeName.trim() || s.storeName }
            : s
        ),
      }

      await db.transact(
        db.tx.stores[storeId].update({
          userId: userEmail,
          slug: finalSlug,
          name: storeName.trim(),
          status: 'draft',
          createdAt: new Date(),
          config,
        })
      )

      navigate({ to: '/dashboard/builder', search: { storeId, plan: '' } })
    } catch {
      setError(t(T.error))
    } finally {
      setCreating(false)
    }
  }

  // Arrows adapt to text direction
  const NextIcon = isRtl ? ArrowLeft : ArrowRight
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const stepSeparator = isRtl ? '←' : '→'

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir={dir}>
      <div className="max-w-lg mx-auto">
        {/* Back to dashboard */}
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <BackIcon size={16} />
          {t(T.backToDashboard)}
        </button>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-border">
            <h2 className="text-xl font-bold">{t(T.createStore)}</h2>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-2">
              {([1, 2] as const).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      s === step
                        ? 'bg-primary text-primary-foreground'
                        : s < step
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  <span className={cn('text-xs', s === step ? 'font-semibold' : 'text-muted-foreground')}>
                    {s === 1 ? t(T.step1Label) : t(T.step2Label)}
                  </span>
                  {s < 2 && <span className="text-muted-foreground text-xs">{stepSeparator}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {step === 1 && (
              <Step1
                storeName={storeName}
                slug={slug}
                locale={locale}
                seoTitle={seoTitle}
                seoDesc={seoDesc}
                onNameChange={handleNameChange}
                onSlugChange={handleSlugChange}
                onLocaleChange={setLocale}
                onSeoTitleChange={setSeoTitle}
                onSeoDescChange={setSeoDesc}
                storeDir={locale === 'ar' ? 'rtl' : 'ltr'}
                t={t}
              />
            )}
            {step === 2 && (
              <Step2
                productName={productName}
                price={price}
                currency={currency}
                images={images}
                onProductNameChange={setProductName}
                onPriceChange={setPrice}
                onCurrencyChange={setCurrency}
                onImagesChange={setImages}
                storeDir={locale === 'ar' ? 'rtl' : 'ltr'}
                t={t}
              />
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border gap-3">
            {step === 2 ? (
              <Button variant="ghost" size="sm" onClick={() => { setStep(1); setError(null) }} className="gap-1.5">
                <BackIcon size={14} />
                {t(T.back)}
              </Button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <Button onClick={goToStep2} className="gap-1.5 ms-auto">
                {t(T.next)}
                <NextIcon size={14} />
              </Button>
            )}
            {step === 2 && (
              <Button onClick={handleCreate} disabled={creating} className="gap-1.5">
                {creating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t(T.creating)}
                  </>
                ) : (
                  <>
                    {t(T.createAndOpen)}
                    <NextIcon size={14} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 1: Store Info ──────────────────────────────────────────────────────

interface Step1Props {
  storeName: string
  slug: string
  locale: 'ar' | 'fr' | 'en'
  seoTitle: string
  seoDesc: string
  storeDir: 'rtl' | 'ltr'
  onNameChange: (v: string) => void
  onSlugChange: (v: string) => void
  onLocaleChange: (v: 'ar' | 'fr' | 'en') => void
  onSeoTitleChange: (v: string) => void
  onSeoDescChange: (v: string) => void
  t: (k: Record<'ar' | 'fr' | 'en', string>) => string
}

function Step1({
  storeName, slug, locale, seoTitle, seoDesc, storeDir,
  onNameChange, onSlugChange, onLocaleChange, onSeoTitleChange, onSeoDescChange, t
}: Step1Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-primary">
        <Store size={18} />
        <span className="text-sm font-semibold">{t(T.step1Label)}</span>
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.storeName)}</Label>
        <Input
          value={storeName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t(T.storeNamePlaceholder)}
          dir={storeDir}
          autoFocus
          className="text-base"
        />
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.slugLabel)}</Label>
        <Input
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="font-mono text-sm"
          dir="ltr"
          placeholder="my-store"
        />
        <p className="text-xs text-muted-foreground">{t(T.slugHint)}</p>
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.locale)}</Label>
        <div className="flex gap-2">
          {(['ar', 'fr', 'en'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onLocaleChange(loc)}
              className={cn(
                'flex-1 py-2 text-sm font-bold border-2 rounded-lg transition-all',
                locale === loc
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              {loc === 'ar' ? '🇩🇿 عربي' : loc === 'fr' ? '🇫🇷 FR' : '🇺🇸 EN'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground">{t(T.seoTitle)}</Label>
        <Input
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder={locale === 'ar' ? 'حقيبة ظهر للمدرسة | متجري' : 'My Product | My Store'}
          dir={storeDir}
        />
        <p className="text-xs text-muted-foreground">{t(T.seoTitleHint)}</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground">{t(T.seoDesc)}</Label>
        <Textarea
          value={seoDesc}
          onChange={(e) => onSeoDescChange(e.target.value)}
          placeholder={locale === 'ar' ? 'اطلب منتجك الآن بتوصيل مجاني لجميع الولايات.' : 'Order now with free shipping.'}
          rows={3}
          className="resize-none"
          dir={storeDir}
        />
        <p className="text-xs text-muted-foreground">{t(T.seoDescHint)}</p>
      </div>
    </div>
  )
}

// ── Step 2: Product ─────────────────────────────────────────────────────────

interface Step2Props {
  productName: string
  price: string
  currency: 'DZD' | 'USD'
  images: string[]
  storeDir: 'rtl' | 'ltr'
  onProductNameChange: (v: string) => void
  onPriceChange: (v: string) => void
  onCurrencyChange: (v: 'DZD' | 'USD') => void
  onImagesChange: (imgs: string[]) => void
  t: (k: Record<'ar' | 'fr' | 'en', string>) => string
}

function Step2({
  productName, price, currency, images, storeDir,
  onProductNameChange, onPriceChange, onCurrencyChange, onImagesChange, t
}: Step2Props) {
  const updateImage = (index: number, url: string) => {
    const next = [...images]
    next[index] = url
    onImagesChange(next.filter(Boolean))
  }

  const addSlot = () => {
    if (images.length < 5) onImagesChange([...images, ''])
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-primary">
        <Package size={18} />
        <span className="text-sm font-semibold">{t(T.step2Label)}</span>
      </div>

      <div className="space-y-1.5">
        <Label>{t(T.productName)}</Label>
        <Input
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder={t(T.productNamePlaceholder)}
          dir={storeDir}
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Label>{t(T.price)}</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="2500"
            dir="ltr"
          />
        </div>
        <div className="w-28 space-y-1.5">
          <Label>{t(T.currency)}</Label>
          <div className="flex gap-1 pt-0.5">
            {(['DZD', 'USD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCurrencyChange(c)}
                className={cn(
                  'flex-1 py-2 text-xs font-bold border-2 rounded-lg transition-all',
                  currency === c
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t(T.productImages)}</Label>
          {images.length < 5 && (
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus size={12} />
              {t(T.addImage)}
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t(T.imageHint)}</p>

        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <ImageUpload
                value={img}
                onChange={(url) => updateImage(idx, url)}
                label={`${t({ ar: 'صورة', fr: 'Image', en: 'Image' })} ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0 end-0 text-xs text-red-500 hover:underline"
                aria-label={t(T.removeImage)}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length === 0 && (
            <button
              type="button"
              onClick={addSlot}
              className="w-full py-8 border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm hover:border-primary/50 hover:text-primary transition-colors flex flex-col items-center gap-2"
            >
              <Plus size={20} />
              {t(T.addImage)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
