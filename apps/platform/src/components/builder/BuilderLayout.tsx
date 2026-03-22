import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { SectionList } from './SectionList'
import { StorePreview } from './StorePreview'
import { ThemePanel } from './ThemePanel'
import { HeroForm } from './forms/HeroForm'
import { FeaturesForm } from './forms/FeaturesForm'
import { TestimonialsForm } from './forms/TestimonialsForm'
import { FaqForm } from './forms/FaqForm'
import { GuaranteeForm } from './forms/GuaranteeForm'
import { OrderFormForm } from './forms/OrderFormForm'
import { useNavigate } from '@tanstack/react-router'
import type { StoreConfig, Section } from '@7aba/store-ui'
import { Loader2, Check, Monitor, Smartphone, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BuilderLayoutProps {
  storeId: string
}

function RightPanel() {
  const { config, selectedSectionId } = useBuilderStore()

  if (!selectedSectionId) return <ThemePanel />

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
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview')

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
        hydrateConfig(parsed as StoreConfig)
      } catch {
        // keep default config if parse fails
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(data as any)?.stores?.[0]?.id])

  // Auto-save on config change
  useEffect(() => {
    saveToInstantDB(storeId, db)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, storeId])

  const MOBILE_TABS: { key: MobileTab; label: string }[] = [
    { key: 'sections', label: 'الأقسام' },
    { key: 'preview', label: 'المعاينة' },
    { key: 'settings', label: 'الإعدادات' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* Top bar */}
      <header className="h-14 border-b border-zinc-200 flex items-center px-4 gap-3 shrink-0 bg-white">
        <Input
          type="text"
          value={config.meta.name}
          onChange={(e) => updateMeta({ name: e.target.value })}
          className="max-w-[200px] h-8 text-sm font-medium"
          dir="rtl"
          placeholder="اسم المتجر"
          aria-label="اسم المتجر"
          id="store-name-input"
        />

        <div className="flex items-center gap-1 text-xs text-zinc-400 ms-auto">
          {isSaving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Check size={12} className="text-green-500" />
              تم الحفظ
            </>
          )}
        </div>

        <Button
          size="sm"
          onClick={() => navigate({ to: '/dashboard/deploy', search: { storeId, tier: 'starter' } })}
          className="gap-1.5"
        >
          <Rocket size={13} />
          نشر
        </Button>
      </header>

      {/* Desktop: three-column layout */}
      <div className="flex-1 hidden lg:flex overflow-hidden">
        {/* Left panel: section list */}
        <aside className="w-60 border-e border-zinc-200 shrink-0 overflow-y-auto flex flex-col">
          <SectionList />
        </aside>

        {/* Center: preview */}
        <main className="flex-1 overflow-hidden">
          <StorePreview />
        </main>

        {/* Right panel: forms / theme */}
        <aside className="w-80 border-s border-zinc-200 shrink-0 overflow-y-auto">
          <RightPanel />
        </aside>
      </div>

      {/* Mobile: tabbed layout */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        {/* Mobile tab content */}
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
        <nav className="h-12 border-t border-zinc-200 flex shrink-0">
          {MOBILE_TABS.map(({ key, label }) => (
            <Button
              key={key}
              variant={mobileTab === key ? 'default' : 'ghost'}
              onClick={() => setMobileTab(key)}
              className="flex-1 rounded-none h-full text-sm"
            >
              {label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
