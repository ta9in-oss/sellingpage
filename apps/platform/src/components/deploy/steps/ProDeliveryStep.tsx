import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getDownloadUrl } from '@/server/getDownloadUrl'
import type { DownloadType } from '@/server/getDownloadUrl'
import { Download, Package, Smartphone, Code2 } from 'lucide-react'

interface Props {
  storeId: string
  userEmail: string
  tier: 'starter' | 'pro' | 'agency'
}

export function ProDeliveryStep({ userEmail, tier }: Props) {
  const [downloading, setDownloading] = useState<DownloadType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (downloadType: DownloadType) => {
    setDownloading(downloadType)
    setError(null)
    try {
      const result = await getDownloadUrl({ data: { downloadType, userEmail } })
      const a = document.createElement('a')
      a.href = result.url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e: unknown) {
      setError((e as Error)?.message ?? 'تعذّر التحميل. أعد المحاولة.')
    } finally {
      setDownloading(null)
    }
  }

  type DownloadItem = {
    type: DownloadType
    label: string
    description: string
    icon: React.ReactNode
    tiers: string[]
  }

  const items: DownloadItem[] = [
    {
      type: 'store-source',
      label: 'كود المتجر (React)',
      description: 'كود مصدر متجرك بالكامل — TanStack Start + React 19',
      icon: <Package className="h-5 w-5 text-white" />,
      tiers: ['pro', 'agency'],
    },
    {
      type: 'store-app',
      label: 'كود تطبيق المتجر',
      description: 'كود مصدر تطبيق الجوال للمتجر',
      icon: <Smartphone className="h-5 w-5 text-white" />,
      tiers: ['pro', 'agency'],
    },
    {
      type: 'platform-source',
      label: 'كود المنصة الكاملة',
      description: 'كود مصدر منصة حبة ستور بالكامل',
      icon: <Code2 className="h-5 w-5 text-white" />,
      tiers: ['agency'],
    },
  ]

  const available = items.filter((item) => item.tiers.includes(tier))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">الكود المصدري</h2>
        <p className="text-sm text-muted-foreground mt-1">
          احصل على كود متجرك ومنصتك
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {available.map((item) => (
          <div key={item.type} className="border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(item.type)}
              disabled={!!downloading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm border rounded-lg font-medium transition-colors shrink-0',
                downloading === item.type ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
              )}
            >
              {downloading === item.type ? (
                <>
                  <span className="animate-spin text-xs">⏳</span>
                  <span>جارٍ التحميل...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>تحميل</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
// Keep export to avoid TS unused warning
export { GitHubIcon as _GitHubIcon }

