import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  storeId: string
}

// Stubs — full implementation will use TanStack Start server functions
async function createGitHubRepo(_storeId: string): Promise<{ repoUrl: string }> {
  await new Promise((r) => setTimeout(r, 1200))
  return { repoUrl: `https://github.com/your-org/${_storeId}` }
}

async function downloadStoreZip(_storeId: string): Promise<{ status: 'coming_soon' }> {
  await new Promise((r) => setTimeout(r, 600))
  return { status: 'coming_soon' }
}

export function ProDeliveryStep({ storeId }: Props) {
  const [ghConnecting, setGhConnecting] = useState(false)
  const [ghConnected, setGhConnected] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')

  const [zipLoading, setZipLoading] = useState(false)
  const [zipStatus, setZipStatus] = useState<'idle' | 'coming_soon'>('idle')

  const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&scope=repo&state=${encodeURIComponent(storeId)}`

  const handleGitHub = async () => {
    setGhConnecting(true)
    try {
      // Open OAuth popup
      const popup = window.open(githubOAuthUrl, 'github-oauth', 'width=620,height=720,noopener')
      if (!popup) {
        // Fallback: simulate connection for dev
        const result = await createGitHubRepo(storeId)
        setRepoUrl(result.repoUrl)
        setGhConnected(true)
      }
      // Real implementation: listen for postMessage from /auth/github callback
    } finally {
      setGhConnecting(false)
    }
  }

  const handleDownloadZip = async () => {
    setZipLoading(true)
    try {
      const result = await downloadStoreZip(storeId)
      setZipStatus(result.status)
    } finally {
      setZipLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">خيارات التسليم المتقدمة</h2>
        <p className="text-sm text-muted-foreground mt-1">
          احصل على الكود المصدري لمتجرك
        </p>
      </div>

      {/* GitHub card */}
      <div className="border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
            <GitHubIcon />
          </div>
          <div>
            <p className="font-semibold text-sm">GitHub Repository</p>
            <p className="text-xs text-muted-foreground">كود المتجر كمستودع خاص</p>
          </div>
        </div>

        {!ghConnected ? (
          <button
            onClick={handleGitHub}
            disabled={ghConnecting}
            className={cn(
              'px-4 py-2 text-sm border rounded-lg font-medium transition-colors',
              ghConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
            )}
          >
            {ghConnecting ? 'جارٍ الاتصال...' : 'ربط GitHub'}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              متصل
            </div>
            <div className="flex items-center gap-2" dir="ltr">
              <span className="flex-1 px-3 py-2 text-xs bg-muted rounded-lg font-mono truncate">
                {repoUrl}
              </span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs border rounded-lg hover:bg-muted transition-colors shrink-0 font-medium"
              >
                افتح على GitHub
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ZIP download card */}
      <div className="border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">ZIP</span>
          </div>
          <div>
            <p className="font-semibold text-sm">ملف ZIP</p>
            <p className="text-xs text-muted-foreground">تحميل كامل ملفات المتجر</p>
          </div>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={zipLoading || zipStatus === 'coming_soon'}
          className={cn(
            'px-4 py-2 text-sm border rounded-lg font-medium transition-colors',
            zipLoading || zipStatus === 'coming_soon'
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-muted'
          )}
        >
          {zipLoading ? 'جارٍ التحضير...' : 'تحميل كملف ZIP'}
        </button>

        {zipStatus === 'coming_soon' && (
          <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-lg">
            🔜 قريباً — سيتوفر هذا الخيار قريباً
          </p>
        )}
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
