import { useState, useEffect, useRef, useCallback } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import type { StoreConfig } from '@7aba/store-ui'
import { useLang } from '@/hooks/useLang'

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

const T = {
  step0: { ar: 'التحقق من الإعدادات', fr: 'Vérification des paramètres', en: 'Validating settings' },
  step1: { ar: 'توليد ملفات الإعداد', fr: 'Génération des fichiers de configuration', en: 'Generating config files' },
  step2: { ar: 'الاتصال بـ Cloudflare', fr: 'Connexion à Cloudflare', en: 'Connecting to Cloudflare' },
  step3: { ar: 'إنشاء/تحديث مشروع Pages', fr: 'Création/mise à jour du projet Pages', en: 'Creating/updating Pages project' },
  step4: { ar: 'التحقق من الموقع', fr: 'Vérification du site', en: 'Verifying site' },
  step5: { ar: 'إضافة مدير المتجر', fr: 'Ajout de l\'administrateur', en: 'Adding store admin' },
  step6: { ar: 'حفظ البيانات', fr: 'Sauvegarde des données', en: 'Saving data' },
  deployFailed: { ar: 'فشلت عملية النشر. يرجى التحقق من الإعدادات والمحاولة مجدداً.', fr: 'Le déploiement a échoué. Vérifiez les paramètres et réessayez.', en: 'Deployment failed. Please check your settings and try again.' },
  retry: { ar: 'حاول مجدداً', fr: 'Réessayer', en: 'Try again' },
}

// Generous vs. the CI job's own 20-minute cap plus queue wait: this only fires
// when CI never reported at all, so it must not undercut a slow-but-fine build.
const DEPLOY_TIMEOUT_MS = 25 * 60 * 1000

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function DeployingStep({ storeId, onComplete, onError }: Props) {
  const { t } = useLang()

  const STEP_LABELS = [
    t(T.step0),
    t(T.step1),
    t(T.step2),
    t(T.step3),
    t(T.step4),
    t(T.step5),
    t(T.step6),
  ]

  const initialSteps = (): DeployStep[] =>
    STEP_LABELS.map((label, id) => ({ id, label, status: 'pending' as StepStatus }))

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
  const deployStatus = store?.deployStatus as 'queued' | 'building' | 'live' | 'failed' | undefined
  const doneRef = useRef(false)
  // Guards against reacting to the previous deploy's status; see runDeploy.
  const dispatchedRef = useRef(false)
  const [watchdogStartedAt, setWatchdogStartedAt] = useState<number | null>(null)

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg])
  }, [])

  const setStepStatus = useCallback((id: number, status: StepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }, [])

  const runDeploy = useCallback(async () => {
    doneRef.current = false
    dispatchedRef.current = false
    setWatchdogStartedAt(null)
    setHasError(false)
    setLogs(['> بدء عملية النشر...'])
    setSteps(initialSteps())

    try {
      // Step 0: Validate settings
      setStepStatus(0, 'running')
      addLog('> التحقق من الإعدادات...')
      await delay(400)
      if (!config.meta.slug) throw new Error('الرابط (slug) مطلوب')
      const cfAccountId = store?.cfAccountId ?? ''
      const cfApiToken = store?.cfApiToken ?? ''
      const instantAppId = store?.instantAppId ?? ''
      const instantAdminToken = store?.instantAdminToken ?? ''
      if (!cfAccountId || !cfApiToken) throw new Error('بيانات Cloudflare مطلوبة. يرجى ربط الحساب أولاً')
      if (!instantAppId || !instantAdminToken) throw new Error('بيانات InstantDB مطلوبة. يرجى ربط الحساب أولاً')
      addLog(`✓ Slug: ${config.meta.slug}`)
      addLog(`✓ CF Account: ${cfAccountId.slice(0, 8)}...`)
      addLog(`✓ InstantDB App: ${instantAppId}`)
      setStepStatus(0, 'done')

      // Step 1: Prepare hand-off to CI
      setStepStatus(1, 'running')
      addLog('> تجهيز عملية النشر على الخادم...')
      await delay(300)
      setStepStatus(1, 'done')

      // Step 2: Trigger the deploy workflow (build + upload happen in CI)
      setStepStatus(2, 'running')
      addLog('> إرسال طلب النشر...')
      const { triggerStoreDeploy } = await import('@/server/triggerStoreDeploy')
      await triggerStoreDeploy({ data: { storeId } })
      // Only now may the status effect act: before the dispatch, deployStatus
      // still holds the PREVIOUS deploy's value, and acting on a stale `live`
      // would report success for a build that has not begun.
      dispatchedRef.current = true
      setWatchdogStartedAt(Date.now())
      addLog('✓ تم إرسال الطلب. جاري بناء المتجر ونشره على Cloudflare...')
      // Steps 3–6 (build, deploy, verify, save) are driven by deployStatus below.

      // Best-effort: add the store admin to the merchant's InstantDB now.
      const adminEmail = store?.adminEmail
      if (adminEmail && instantAdminToken && instantAppId) {
        try {
          const { addStoreAdmin } = await import('@/server/addStoreAdmin')
          await addStoreAdmin({ data: { storeId, adminEmail } })
          addLog(`✓ تم إضافة المدير: ${adminEmail}`)
        } catch (adminErr) {
          addLog(`⚠ تعذّر إضافة المدير تلقائياً: ${(adminErr as Error).message}`)
          addLog('  أضفه يدوياً من InstantDB Explorer → جدول users')
        }
      }
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
  }, [retryCount, store?.cfAccountId, store?.cfApiToken, store?.instantAppId, config.meta.slug])

  useEffect(() => {
    runDeploy()
  }, [runDeploy])

  // Drive steps 3–6 + completion from the CI-reported deployStatus.
  //
  // This is a live InstantDB subscription, not a poll: CI writes the row and the
  // update arrives over the open socket, so the wizard cannot show a stale step.
  // The one thing a subscription cannot tell us is that CI never reported at all
  // (queue backlog, runner outage) — that is the watchdog below.
  useEffect(() => {
    if (doneRef.current || !dispatchedRef.current) return
    if (deployStatus === 'building') {
      setStepStatus(2, 'done')
      setStepStatus(3, 'running')
    }
    if (deployStatus === 'live') {
      doneRef.current = true
      ;[2, 3, 4, 5, 6].forEach((i) => setStepStatus(i, 'done'))
      addLog(`> 🎉 المتجر أصبح مباشراً: ${store?.deployedUrl ?? ''}`)
      onComplete()
    }
    if (deployStatus === 'failed') {
      doneRef.current = true
      setSteps((prev) => prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' } : s)))
      setHasError(true)
      addLog('✗ فشل البناء على الخادم. راجع الإعدادات وحاول مجدداً.')
      onError()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployStatus, store?.deployedUrl])

  // Watchdog: if CI never reports a terminal status, fail the wizard instead of
  // spinning forever. A merchant who sees an honest error retries; one watching
  // an endless spinner assumes the product is broken and leaves.
  useEffect(() => {
    if (watchdogStartedAt === null) return
    const timer = setTimeout(() => {
      if (doneRef.current) return
      doneRef.current = true
      setSteps((prev) => prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' } : s)))
      setHasError(true)
      addLog('✗ انتهت المهلة دون رد من الخادم. المتجر قد يكون قيد البناء — أعد المحاولة بعد قليل.')
      onError()
    }, DEPLOY_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [watchdogStartedAt, addLog, onError])

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
          <p className="text-sm text-destructive">{t(T.deployFailed)}</p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-5 py-2.5 rounded-lg border font-semibold text-sm hover:bg-muted transition-colors"
          >
            {t(T.retry)}
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
