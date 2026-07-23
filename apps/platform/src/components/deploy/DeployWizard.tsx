import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ReviewStep } from './steps/ReviewStep'
import { ConnectServicesStep } from './steps/ConnectServicesStep'
import { SetupAdminStep } from './steps/SetupAdminStep'
import { DeployingStep } from './steps/DeployingStep'
import { LiveStep } from './steps/LiveStep'
import { ProDeliveryStep } from './steps/ProDeliveryStep'
import { useLang } from '@/hooks/useLang'

interface Props {
  storeId: string
  tier: 'starter' | 'pro' | 'agency'
  userEmail: string
}

// All tiers: review → connect → admin-setup → deploying → live
// Pro/Agency additionally get source code delivery on the live step
type WizardStep = 'review' | 'connect' | 'admin-setup' | 'deploying' | 'live'

const T = {
  deployStore: { ar: 'نشر المتجر', fr: 'Déployer la boutique', en: 'Deploy Store' },
  tierStarter: { ar: 'خطة المبتدئ', fr: 'Formule Débutant', en: 'Starter plan' },
  tierPro: { ar: 'خطة المستقل', fr: 'Formule Freelancer', en: 'Freelancer plan' },
  tierAgency: { ar: 'خطة الوكالة', fr: 'Formule Run One', en: 'Run One plan' },
  stepReview: { ar: 'المراجعة', fr: 'Révision', en: 'Review' },
  stepConnect: { ar: 'الخدمات', fr: 'Services', en: 'Services' },
  stepAdmin: { ar: 'المدير', fr: 'Admin', en: 'Admin' },
  stepDeploy: { ar: 'النشر', fr: 'Déploiement', en: 'Deploy' },
  stepLive: { ar: 'مكتمل', fr: 'Terminé', en: 'Done' },
}

export function DeployWizard({ storeId, tier, userEmail }: Props) {
  const { t } = useLang()
  const isProOrAgency = tier === 'pro' || tier === 'agency'
  const [currentStep, setCurrentStep] = useState(0)
  const [showProDelivery, setShowProDelivery] = useState(false)

  const STEPS: { key: WizardStep; label: string }[] = [
    { key: 'review', label: t(T.stepReview) },
    { key: 'connect', label: t(T.stepConnect) },
    { key: 'admin-setup', label: t(T.stepAdmin) },
    { key: 'deploying', label: t(T.stepDeploy) },
    { key: 'live', label: t(T.stepLive) },
  ]

  const advance = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))

  const currentKey = STEPS[currentStep].key

  const tierLabel =
    tier === 'starter' ? t(T.tierStarter) : tier === 'pro' ? t(T.tierPro) : t(T.tierAgency)

  const renderStep = () => {
    if (currentKey === 'review') {
      return <ReviewStep storeId={storeId} onContinue={advance} />
    }
    if (currentKey === 'connect') {
      return <ConnectServicesStep storeId={storeId} onContinue={advance} />
    }
    if (currentKey === 'admin-setup') {
      return <SetupAdminStep storeId={storeId} onContinue={advance} />
    }
    if (currentKey === 'deploying') {
      return (
        <DeployingStep
          storeId={storeId}
          onComplete={() => {
            advance()
            if (isProOrAgency) setShowProDelivery(true)
          }}
          onError={() => {/* stay on this step, error state shown inside DeployingStep */}}
        />
      )
    }
    if (currentKey === 'live') {
      return (
        <div className="space-y-6">
          <LiveStep storeId={storeId} />
          {showProDelivery && (
            <div className="border-t pt-6">
              <ProDeliveryStep storeId={storeId} userEmail={userEmail} tier={tier} />
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t(T.deployStore)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tierLabel}</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((step, index) => (
          <div key={step.key} className="flex items-center gap-0 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  index < currentStep && 'bg-green-500 text-white',
                  index === currentStep && 'bg-primary text-primary-foreground',
                  index > currentStep && 'bg-muted text-muted-foreground'
                )}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  index === currentStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mb-5 transition-colors',
                  index < currentStep ? 'bg-green-500' : 'bg-border'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div
        key={currentStep}
        className="animate-in slide-in-from-right-4 fade-in duration-300"
      >
        <div className="border rounded-2xl p-6 bg-card">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
