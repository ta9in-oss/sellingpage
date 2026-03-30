import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getDownloadUrl } from '@/server/getDownloadUrl'
import type { DownloadType } from '@/server/getDownloadUrl'
import { Download, Package, Smartphone, Code2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

interface Props {
  storeId: string
  userEmail: string
  tier: 'starter' | 'pro' | 'agency'
}

const T = {
  sourceCode: { ar: 'الكود المصدري', fr: 'Code source', en: 'Source code' },
  sourceCodeDesc: { ar: 'احصل على كود متجرك ومنصتك', fr: 'Obtenez le code de votre boutique et de votre plateforme', en: 'Get the code for your store and platform' },
  downloadFailed: { ar: 'تعذّر التحميل. أعد المحاولة.', fr: 'Échec du téléchargement. Réessayez.', en: 'Download failed. Please try again.' },
  storeSourceLabel: { ar: 'كود المتجر (React)', fr: 'Code de la boutique (React)', en: 'Store code (React)' },
  storeSourceDesc: { ar: 'كود مصدر متجرك بالكامل — TanStack Start + React 19', fr: 'Code source complet de votre boutique — TanStack Start + React 19', en: 'Full store source code — TanStack Start + React 19' },
  storeAppLabel: { ar: 'كود تطبيق المتجر', fr: 'Code de l\'application mobile', en: 'Store app code' },
  storeAppDesc: { ar: 'كود مصدر تطبيق الجوال للمتجر', fr: 'Code source de l\'application mobile de la boutique', en: 'Store mobile app source code' },
  platformSourceLabel: { ar: 'كود المنصة الكاملة', fr: 'Code complet de la plateforme', en: 'Full platform code' },
  platformSourceDesc: { ar: 'كود مصدر منصة حبة ستور بالكامل', fr: 'Code source complet de la plateforme 7aba Store', en: 'Full 7aba Store platform source code' },
  downloading: { ar: 'جارٍ التحميل...', fr: 'Chargement...', en: 'Loading...' },
  download: { ar: 'تحميل', fr: 'Télécharger', en: 'Download' },
}

export function ProDeliveryStep({ userEmail, tier }: Props) {
  const { t } = useLang()
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
      setError((e as Error)?.message ?? t(T.downloadFailed))
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
      label: t(T.storeSourceLabel),
      description: t(T.storeSourceDesc),
      icon: <Package className="h-5 w-5 text-white" />,
      tiers: ['pro', 'agency'],
    },
    {
      type: 'store-app',
      label: t(T.storeAppLabel),
      description: t(T.storeAppDesc),
      icon: <Smartphone className="h-5 w-5 text-white" />,
      tiers: ['pro', 'agency'],
    },
    {
      type: 'platform-source',
      label: t(T.platformSourceLabel),
      description: t(T.platformSourceDesc),
      icon: <Code2 className="h-5 w-5 text-white" />,
      tiers: ['agency'],
    },
  ]

  const available = items.filter((item) => item.tiers.includes(tier))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">{t(T.sourceCode)}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t(T.sourceCodeDesc)}</p>
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
                  <span>{t(T.downloading)}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>{t(T.download)}</span>
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
