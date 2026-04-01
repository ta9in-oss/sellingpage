import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { exchangeCloudflareOAuth } from '@/server/exchangeCloudflareOAuth'

export const Route = createFileRoute('/auth/cloudflare')({
  component: CloudflareCallbackPage,
})

/**
 * OAuth callback page for Cloudflare.
 *
 * Cloudflare redirects here after user authorization.
 * We exchange the code server-side (to protect the client secret),
 * post the credentials back to the opener window, and close.
 */
function CloudflareCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')

    if (errorParam) {
      setStatus('error')
      setError(errorParam)
      return
    }

    if (!code) {
      setStatus('error')
      setError('لم يتم استلام رمز التفويض من Cloudflare')
      return
    }

    const redirectUri = `${window.location.origin}/auth/cloudflare`
    exchangeCloudflareOAuth({ data: { code, redirectUri } })
      .then(({ accessToken, accountId }) => {
        if (window.opener) {
          window.opener.postMessage(
            { type: 'cloudflare_connected', accountId, apiToken: accessToken },
            window.location.origin
          )
        }
        setStatus('success')
        setTimeout(() => window.close(), 1500)
      })
      .catch((err: Error) => {
        setStatus('error')
        setError(err.message)
      })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-3 p-8">
        {status === 'loading' && (
          <>
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">جارٍ الاتصال بـ Cloudflare...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-700">✓ تم الاتصال بـ Cloudflare بنجاح</p>
            <p className="text-xs text-muted-foreground">سيتم إغلاق هذه النافذة تلقائياً...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700">فشل الاتصال</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <button
              onClick={() => window.close()}
              className="text-xs underline text-muted-foreground hover:text-foreground mt-2"
            >
              إغلاق
            </button>
          </>
        )}
      </div>
    </div>
  )
}
