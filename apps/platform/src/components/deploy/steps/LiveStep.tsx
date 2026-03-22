import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'

interface Props {
  storeId: string
}

export function LiveStep({ storeId }: Props) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [checkmarkVisible, setCheckmarkVisible] = useState(false)

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })
  const deployedUrl = storeData?.stores?.[0]?.deployedUrl ?? ''

  // Trigger checkmark animation on mount
  useEffect(() => {
    const t = setTimeout(() => setCheckmarkVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleCopy = async () => {
    if (!deployedUrl) return
    await navigator.clipboard.writeText(deployedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappUrl = deployedUrl
    ? `https://wa.me/?text=${encodeURIComponent('اكتشف متجري الجديد: ' + deployedUrl)}`
    : '#'

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Animated checkmark */}
      <div
        className={cn(
          'w-20 h-20 rounded-full bg-green-500 flex items-center justify-center transition-all duration-[600ms] ease-out',
          checkmarkVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        )}
      >
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold">متجرك الآن يعمل على الإنترنت! 🎉</h2>
        <p className="text-muted-foreground text-sm mt-1">شارك رابطك مع العالم</p>
      </div>

      {/* Live URL */}
      {deployedUrl ? (
        <div className="w-full max-w-md space-y-3">
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 bg-muted rounded-lg text-sm font-mono text-primary hover:underline break-all"
            dir="ltr"
          >
            {deployedUrl}
          </a>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors',
                copied
                  ? 'bg-green-50 border-green-500 text-green-600'
                  : 'hover:bg-muted'
              )}
            >
              {copied ? '✓ تم النسخ' : 'نسخ الرابط'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-[#25D366] text-white text-center hover:bg-[#1ebe5b] transition-colors"
            >
              مشاركة واتساب
            </a>
          </div>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}

      {/* Dashboard button */}
      <button
        onClick={() => navigate({ to: '/dashboard' })}
        className="w-full max-w-md py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        الذهاب للوحة التحكم
      </button>
    </div>
  )
}
