import { useEffect, useRef, useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { SectionList } from './SectionList'
import { StorePreview } from './StorePreview'
import { ThemePanel } from './ThemePanel'
import { ProductPanel } from './ProductPanel'
import { NotificationsPanel } from './NotificationsPanel'
import { PaymentPanel } from './PaymentPanel'
import { HeroForm } from './forms/HeroForm'
import { FeaturesForm } from './forms/FeaturesForm'
import { TestimonialsForm } from './forms/TestimonialsForm'
import { FaqForm } from './forms/FaqForm'
import { GuaranteeForm } from './forms/GuaranteeForm'
import { OrderFormForm } from './forms/OrderFormForm'
import { useNavigate } from '@tanstack/react-router'
import type { StoreConfig, Section } from '@7aba/store-ui'
import { Loader2, Check, Rocket, Palette, Package, Bell, Globe, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLang } from '@/hooks/useLang'

interface BuilderLayoutProps {
  storeId: string
}

type SettingsTab = 'theme' | 'product' | 'notifications' | 'site' | 'payment'

const T = {
  siteDataSeo: { ar: 'بيانات الموقع والـ SEO', fr: 'Données du site & SEO', en: 'Site Data & SEO' },
  tabTitle: { ar: 'عنوان التاب (title)', fr: 'Titre de l\'onglet (title)', en: 'Tab title (title)' },
  tabTitlePlaceholder: { ar: 'مثال: حقيبة ظهر للمدرسة | متجرك', fr: 'Ex: Sac à dos scolaire | Votre boutique', en: 'Ex: School backpack | Your Store' },
  tabTitleHint: { ar: 'يظهر في تاب المتصفح ونتائج البحث', fr: 'Apparaît dans l\'onglet du navigateur et les résultats de recherche', en: 'Shown in browser tab and search results' },
  descriptionLabel: { ar: 'الوصف (description)', fr: 'Description (description)', en: 'Description (description)' },
  descriptionPlaceholder: { ar: 'مثال: اطلب حقيبتك الآن بتوصيل مجاني لجميع ولايات الجزائر.', fr: 'Ex: Commandez votre sac maintenant avec livraison gratuite.', en: 'Ex: Order your bag now with free shipping.' },
  descriptionHint: { ar: 'يظهر تحت الرابط في نتائج جوجل (130-160 حرف مثالي)', fr: 'Apparaît sous le lien dans les résultats Google (130-160 caractères idéal)', en: 'Shown below the link in Google results (130-160 chars ideal)' },
  slugLabel: { ar: 'رابط المتجر (slug)', fr: 'Lien de la boutique (slug)', en: 'Store slug (slug)' },
  tabTheme: { ar: 'الثيم', fr: 'Thème', en: 'Theme' },
  tabProduct: { ar: 'المنتج', fr: 'Produit', en: 'Product' },
  tabNotifications: { ar: 'الإشعارات', fr: 'Notifications', en: 'Notifications' },
  tabPayment: { ar: 'الدفع', fr: 'Paiement', en: 'Payment' },
  tabSite: { ar: 'الموقع', fr: 'Site', en: 'Site' },
  storeName: { ar: 'اسم المتجر', fr: 'Nom de la boutique', en: 'Store name' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  saved: { ar: 'تم الحفظ', fr: 'Enregistré', en: 'Saved' },
  deployStore: { ar: 'نشر المتجر', fr: 'Déployer la boutique', en: 'Deploy Store' },
  mobileSections: { ar: 'الأقسام', fr: 'Sections', en: 'Sections' },
  mobilePreview: { ar: 'المعاينة', fr: 'Aperçu', en: 'Preview' },
  mobileSettings: { ar: 'الإعدادات', fr: 'Paramètres', en: 'Settings' },
}

function SitePanel() {
  const { config, updateMeta } = useBuilderStore()
  const { meta } = config
  const { t } = useLang()
  return (
    <div className="p-4 space-y-4" dir="rtl">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{t(T.siteDataSeo)}</p>
      <div className="space-y-1">
        <Label className="text-xs">{t(T.tabTitle)}</Label>
        <Input
          value={meta.siteTitle ?? ''}
          onChange={(e) => updateMeta({ siteTitle: e.target.value })}
          placeholder={t(T.tabTitlePlaceholder)}
          className="text-sm"
          dir="rtl"
        />
        <p className="text-[11px] text-zinc-400">{t(T.tabTitleHint)}</p>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t(T.descriptionLabel)}</Label>
        <Textarea
          value={meta.siteDescription ?? ''}
          onChange={(e) => updateMeta({ siteDescription: e.target.value })}
          placeholder={t(T.descriptionPlaceholder)}
          className="text-sm resize-none"
          rows={3}
          dir="rtl"
        />
        <p className="text-[11px] text-zinc-400">{t(T.descriptionHint)}</p>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">{t(T.slugLabel)}</Label>
        <Input
          value={meta.slug ?? ''}
          onChange={(e) => updateMeta({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
          placeholder="my-store"
          className="text-sm font-mono"
          dir="ltr"
        />
        <p className="text-[11px] text-zinc-400">haba.store/<strong>{meta.slug || 'my-store'}</strong></p>
      </div>
    </div>
  )
}

function RightPanel() {
  const { config, selectedSectionId } = useBuilderStore()
  const { t } = useLang()
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('theme')

  if (!selectedSectionId) {
    return (
      <div className="flex flex-col h-full">
        {/* Tab bar */}
        <div className="flex border-b-2 border-black shrink-0">
          {([
            { key: 'theme' as const, label: t(T.tabTheme), Icon: Palette },
            { key: 'product' as const, label: t(T.tabProduct), Icon: Package },
            { key: 'notifications' as const, label: t(T.tabNotifications), Icon: Bell },
            { key: 'payment' as const, label: t(T.tabPayment), Icon: CreditCard },
            { key: 'site' as const, label: t(T.tabSite), Icon: Globe },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setSettingsTab(key)}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors border-e border-black last:border-e-0',
                settingsTab === key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-zinc-500 hover:bg-zinc-50'
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {settingsTab === 'theme' && <ThemePanel />}
          {settingsTab === 'product' && <ProductPanel />}
          {settingsTab === 'notifications' && <NotificationsPanel />}
          {settingsTab === 'payment' && <PaymentPanel />}
          {settingsTab === 'site' && <SitePanel />}
        </div>
      </div>
    )
  }

  const section = config.sections.find((s) => s.id === selectedSectionId) as Section | undefined
  if (!section) return <ThemePanel />

  switch (section.type) {
    case 'hero':
      return <HeroForm />
    case 'features':
      return <FeaturesForm />
    case 'testimonials':
      return <TestimonialsForm />
    case 'faq':
      return <FaqForm />
    case 'guarantee':
      return <GuaranteeForm />
    case 'order-form':
      return <OrderFormForm />
    default:
      return <ThemePanel />
  }
}

type MobileTab = 'sections' | 'preview' | 'settings'

export function BuilderLayout({ storeId }: BuilderLayoutProps) {
  const { config, isSaving, hydrateConfig, updateMeta, saveToInstantDB, selectedSectionId } =
    useBuilderStore()
  const navigate = useNavigate()
  const { t } = useLang()
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview')
  const hasHydratedRef = useRef(false)

  // Load store data from InstantDB
  const { data } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })

  useEffect(() => {
    const store = (data as any)?.stores?.[0]
    if (store?.config) {
      try {
        const parsed =
          typeof store.config === 'string' ? JSON.parse(store.config) : store.config
        // Only hydrate if the config is a complete StoreConfig (has sections array with objects + theme)
        const hasValidSections = Array.isArray(parsed?.sections) &&
          parsed.sections.length > 0 &&
          typeof parsed.sections[0] === 'object' &&
          parsed.sections[0] !== null
        if (hasValidSections && parsed?.theme && typeof parsed.theme === 'object') {
          hydrateConfig(parsed as StoreConfig)
          hasHydratedRef.current = true
        }
      } catch {
        // keep default config if parse fails
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(data as any)?.stores?.[0]?.id])

  // Auto-save on config change — skip the initial render before any user change
  const configRef = useRef(config)
  useEffect(() => {
    if (configRef.current === config) return // skip if config object hasn't changed
    configRef.current = config
    saveToInstantDB(storeId, db)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, storeId])

  const MOBILE_TABS: { key: MobileTab; label: string }[] = [
    { key: 'sections', label: t(T.mobileSections) },
    { key: 'preview', label: t(T.mobilePreview) },
    { key: 'settings', label: t(T.mobileSettings) },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* Top bar — brutalist */}
      <header className="h-14 border-b-2 border-black flex items-center px-4 gap-3 shrink-0 bg-white">
        <Input
          type="text"
          value={config.meta.name}
          onChange={(e) => updateMeta({ name: e.target.value })}
          className="max-w-[200px] h-8 text-sm font-bold border-2 border-black rounded-none shadow-none focus-visible:ring-yellow-400"
          dir="rtl"
          placeholder={t(T.storeName)}
          aria-label={t(T.storeName)}
          id="store-name-input"
        />

        <div className="flex items-center gap-1 text-xs text-zinc-500 ms-auto">
          {isSaving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              {t(T.saving)}
            </>
          ) : (
            <>
              <Check size={12} className="text-green-600" />
              {t(T.saved)}
            </>
          )}
        </div>

        <Button
          size="sm"
          onClick={() => navigate({ to: '/dashboard/deploy', search: { storeId, tier: 'starter' } })}
          className="gap-1.5 rounded-none border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none transition-all"
        >
          <Rocket size={13} />
          {t(T.deployStore)}
        </Button>
      </header>

      {/* Desktop: three-column layout */}
      <div className="flex-1 hidden lg:flex overflow-hidden">
        {/* Left panel */}
        <aside className="w-60 border-e-2 border-black shrink-0 overflow-y-auto flex flex-col bg-white">
          <SectionList />
        </aside>

        {/* Center: preview */}
        <main className="flex-1 overflow-hidden bg-zinc-100">
          <StorePreview />
        </main>

        {/* Right panel */}
        <aside className="w-80 border-s-2 border-black shrink-0 overflow-y-auto bg-white">
          <RightPanel />
        </aside>
      </div>

      {/* Mobile: tabbed layout */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'sections' && (
            <div className="h-full overflow-y-auto">
              <SectionList />
            </div>
          )}
          {mobileTab === 'preview' && (
            <div className="h-full overflow-hidden">
              <StorePreview />
            </div>
          )}
          {mobileTab === 'settings' && (
            <div className="h-full overflow-y-auto">
              <RightPanel />
            </div>
          )}
        </div>

        {/* Mobile tab bar */}
        <nav className="h-12 border-t-2 border-black flex shrink-0">
          {MOBILE_TABS.map(({ key, label }) => (
            <Button
              key={key}
              variant={mobileTab === key ? 'default' : 'ghost'}
              onClick={() => setMobileTab(key)}
              className={cn(
                'flex-1 rounded-none h-full text-sm font-bold border-0',
                mobileTab === key
                  ? 'bg-yellow-400 text-black hover:bg-yellow-400'
                  : 'bg-white text-black hover:bg-zinc-100'
              )}
            >
              {label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
