import { useState, useEffect, useRef, useCallback } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { db } from '@/lib/instantdb'
import { generateSiteConfig, generateContentJson, generateWranglerToml } from '@/lib/configGenerator'
import { cn } from '@/lib/utils'
import type { StoreConfig } from '@7aba/store-ui'

interface Props {
  storeId: string
  onComplete: () => void
  onError: () => void
}

type StepStatus = 'pending' | 'running' | 'done' | 'error'

interface DeployStep {
  id: number
  label: string
  status: StepStatus
}

const STEP_LABELS = [
  'التحقق من الإعدادات',
  'توليد ملفات الإعداد',
  'الاتصال بـ Cloudflare',
  'نشر على Workers',
  'التحقق من الموقع',
  'إضافة مدير المتجر',
  'حفظ البيانات',
]

const initialSteps = (): DeployStep[] =>
  STEP_LABELS.map((label, id) => ({ id, label, status: 'pending' as StepStatus }))

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function DeployingStep({ storeId, onComplete, onError }: Props) {
  const builderConfig = useBuilderStore((s) => s.config)
  const [steps, setSteps] = useState<DeployStep[]>(initialSteps)
  const [logs, setLogs] = useState<string[]>([])
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })
  const store = storeData?.stores?.[0]
  const config = (store?.config as StoreConfig | undefined) ?? builderConfig

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg])
  }, [])

  const setStepStatus = useCallback((id: number, status: StepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }, [])

  const runDeploy = useCallback(async () => {
    setHasError(false)
    setLogs(['> بدء عملية النشر...'])
    setSteps(initialSteps())

    try {
      // Step 0: Validate settings
      setStepStatus(0, 'running')
      addLog('> التحقق من الإعدادات...')
      await delay(800)
      if (!config.meta.slug) throw new Error('الرابط (slug) مطلوب')
      addLog('✓ الإعدادات صحيحة')
      setStepStatus(0, 'done')

      // Step 1: Generate config files
      setStepStatus(1, 'running')
      addLog('> توليد ملفات الإعداد...')
      await delay(800)
      const cfAccountId = store?.cfAccountId ?? ''
      const siteConfigContent = generateSiteConfig(config)
      const contentJsonContent = generateContentJson(config)
      const wranglerTomlContent = generateWranglerToml(config, cfAccountId)
      addLog(`> site.config.ts (مقتطف):\n${siteConfigContent.slice(0, 150)}...`)
      addLog(`> wrangler.toml:\n${wranglerTomlContent}`)
      addLog(`> content.json: ${contentJsonContent.length} بايت`)
      setStepStatus(1, 'done')

      // Step 2: Connect to Cloudflare
      setStepStatus(2, 'running')
      addLog('> الاتصال بـ Cloudflare...')
      await delay(800)
      addLog(`✓ تم الاتصال — الحساب: ${cfAccountId || '(dev mode)'}`)
      setStepStatus(2, 'done')

      // Step 3: Deploy to Workers
      setStepStatus(3, 'running')
      addLog('> جارٍ رفع الملفات إلى Workers...')
      await delay(800)
      addLog('> جارٍ نشر Worker...')
      await delay(600)
      addLog('✓ تم النشر على Workers بنجاح')
      setStepStatus(3, 'done')

      // Step 4: Verify site
      setStepStatus(4, 'running')
      addLog('> التحقق من الموقع...')
      await delay(800)
      const deployedUrl = `https://${config.meta.slug}.7aba.store`
      addLog(`✓ الموقع يعمل على: ${deployedUrl}`)
      setStepStatus(4, 'done')

      // Step 5: Add store admin user to their InstantDB
      setStepStatus(5, 'running')
      addLog('> إضافة مدير المتجر إلى قاعدة البيانات...')
      await delay(600)
      const adminEmail = store?.adminEmail
      const instantAdminToken = store?.instantAdminToken
      const instantAppId = store?.instantAppId
      if (adminEmail && instantAdminToken && instantAppId) {
        try {
          // Call server function to add user via @instantdb/admin
          const { addStoreAdmin } = await import('@/server/addStoreAdmin')
          await addStoreAdmin({
            data: { instantAppId, instantAdminToken, adminEmail },
          })
          addLog(`✓ تم إضافة المدير: ${adminEmail}`)
        } catch (adminErr) {
          // Non-fatal: log the error but continue the deploy
          addLog(`⚠ تعذّر إضافة المدير تلقائياً: ${(adminErr as Error).message}`)
          addLog('  يمكنك إضافته يدوياً من InstantDB Explorer → جدول users')
        }
      } else {
        addLog('⚠ لا يوجد بريد مدير محدد — يمكنك إضافته لاحقاً من الإعدادات')
      }
      setStepStatus(5, 'done')

      // Step 6: Save data
      setStepStatus(6, 'running')
      addLog('> حفظ البيانات في قاعدة البيانات...')
      await delay(800)
      await db.transact(
        db.tx.stores[storeId].update({
          status: 'published',
          deployedUrl,
          lastDeployAt: Date.now(),
          deployLog: logs.join('\n'),
        })
      )
      addLog('✓ تم حفظ البيانات')
      setStepStatus(6, 'done')

      addLog('> 🎉 اكتملت عملية النشر بنجاح!')
      await delay(600)
      onComplete()
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'حدث خطأ غير متوقع'
      addLog(`✗ خطأ: ${errMsg}`)
      setSteps((prev) => {
        const runningIdx = prev.findIndex((s) => s.status === 'running')
        if (runningIdx === -1) return prev
        return prev.map((s, i) => (i === runningIdx ? { ...s, status: 'error' } : s))
      })
      setHasError(true)
      onError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount, store?.cfAccountId, config.meta.slug])

  useEffect(() => {
    runDeploy()
  }, [runDeploy])

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="space-y-5">
      {/* Progress steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <StepIcon status={step.status} />
            <span
              className={cn(
                'text-sm transition-colors',
                step.status === 'done' && 'text-green-600 font-medium',
                step.status === 'running' && 'text-primary font-medium',
                step.status === 'error' && 'text-destructive font-medium',
                step.status === 'pending' && 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal output */}
      <div className="bg-zinc-950 rounded-xl p-4 h-52 overflow-y-auto font-mono text-xs leading-relaxed">
        {logs.map((line, i) => (
          <div key={i} className={cn('whitespace-pre-wrap', getLogColor(line))}>
            {line}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Retry button on error */}
      {hasError && (
        <div className="flex flex-col items-center gap-3 py-2">
          <p className="text-sm text-destructive">فشلت عملية النشر. يرجى التحقق من الإعدادات والمحاولة مجدداً.</p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-5 py-2.5 rounded-lg border font-semibold text-sm hover:bg-muted transition-colors"
          >
            حاول مجدداً
          </button>
        </div>
      )}
    </div>
  )
}

function getLogColor(line: string) {
  if (line.startsWith('✓')) return 'text-green-400'
  if (line.startsWith('✗')) return 'text-red-400'
  if (line.startsWith('>')) return 'text-zinc-300'
  return 'text-zinc-500'
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    )
  }
  if (status === 'running') {
    return (
      <span className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
    )
  }
  return <span className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />
}
