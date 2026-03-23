import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ReviewStep } from './steps/ReviewStep'
import { ConnectServicesStep } from './steps/ConnectServicesStep'
import { DeployingStep } from './steps/DeployingStep'
import { LiveStep } from './steps/LiveStep'
import { ProDeliveryStep } from './steps/ProDeliveryStep'

interface Props {
  storeId: string
  tier: 'starter' | 'pro' | 'enterprise'
}

type StarterStep = 'review' | 'deploying' | 'live'
type ProStep = 'review' | 'connect' | 'deploying' | 'live'

const STARTER_STEPS: { key: StarterStep; label: string }[] = [
  { key: 'review', label: 'المراجعة' },
  { key: 'deploying', label: 'النشر' },
  { key: 'live', label: 'مكتمل' },
]

const PRO_STEPS: { key: ProStep; label: string }[] = [
  { key: 'review', label: 'المراجعة' },
  { key: 'connect', label: 'الخدمات' },
  { key: 'deploying', label: 'النشر' },
  { key: 'live', label: 'مكتمل' },
]

export function DeployWizard({ storeId, tier }: Props) {
  const isProOrEnterprise = tier === 'pro' || tier === 'enterprise'
  const steps = isProOrEnterprise ? PRO_STEPS : STARTER_STEPS
  const [currentStep, setCurrentStep] = useState(0)
  const [showProDelivery, setShowProDelivery] = useState(false)

  const advance = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))

  const currentKey = steps[currentStep].key

  const renderStep = () => {
    if (currentKey === 'review') {
      return <ReviewStep storeId={storeId} onContinue={advance} />
    }
    if (currentKey === 'connect') {
      return <ConnectServicesStep storeId={storeId} onContinue={advance} />
    }
    if (currentKey === 'deploying') {
      return (
        <DeployingStep
          storeId={storeId}
          onComplete={() => {
            advance()
            if (isProOrEnterprise) setShowProDelivery(true)
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
              <ProDeliveryStep storeId={storeId} />
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
        <h1 className="text-2xl font-bold">نشر المتجر</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tier === 'starter' ? 'خطة المبتدئ' : tier === 'pro' ? 'خطة الاحترافي' : 'خطة المؤسسات'}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((step, index) => (
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
            {index < steps.length - 1 && (
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

      {/* Step content with slide-in animation */}
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
