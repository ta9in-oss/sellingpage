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
      {/* Top bar — brutalist */}
      <header className="h-14 border-b-2 border-black flex items-center px-4 gap-3 shrink-0 bg-white">
        <Input
          type="text"
          value={config.meta.name}
          onChange={(e) => updateMeta({ name: e.target.value })}
          className="max-w-[200px] h-8 text-sm font-bold border-2 border-black rounded-none shadow-none focus-visible:ring-yellow-400"
          dir="rtl"
          placeholder="اسم المتجر"
          aria-label="اسم المتجر"
          id="store-name-input"
        />

        <div className="flex items-center gap-1 text-xs text-zinc-500 ms-auto">
          {isSaving ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <Check size={12} className="text-green-600" />
              تم الحفظ
            </>
          )}
        </div>

        <Button
          size="sm"
          onClick={() => navigate({ to: '/dashboard/deploy', search: { storeId, tier: 'starter' } })}
          className="gap-1.5 rounded-none border-2 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 font-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none transition-all"
        >
          <Rocket size={13} />
          نشر المتجر
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
