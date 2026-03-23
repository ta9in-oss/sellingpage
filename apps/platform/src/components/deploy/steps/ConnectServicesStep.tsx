import { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'

interface Props {
  storeId: string
  onContinue: () => void
}

export function ConnectServicesStep({ storeId, onContinue }: Props) {
  const [cfAccountId, setCfAccountId] = useState('')
  const [instantAppId, setInstantAppId] = useState('')
  const [cfConnected, setCfConnected] = useState(false)
  const [instantConnected, setInstantConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const popupRef = useRef<Window | null>(null)

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })

  // Hydrate from existing store data
  useEffect(() => {
    const store = storeData?.stores?.[0]
    if (!store) return
    if (store.cfAccountId) {
      setCfAccountId(store.cfAccountId)
      setCfConnected(true)
    }
    if (store.instantAppId) {
      setInstantAppId(store.instantAppId)
      setInstantConnected(true)
    }
  }, [storeData])

  // Listen for OAuth popup callbacks
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'cloudflare_connected' && typeof e.data.accountId === 'string') {
        setCfAccountId(e.data.accountId)
        setCfConnected(true)
        popupRef.current?.close()
      }
      if (e.data?.type === 'instantdb_connected' && typeof e.data.appId === 'string') {
        setInstantAppId(e.data.appId)
        setInstantConnected(true)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const openCFOAuth = () => {
    const redirectUri = `${window.location.origin}/auth/cloudflare`
    const url = `https://dash.cloudflare.com/oauth2/auth?response_type=code&client_id=YOUR_CF_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&scope=account:read+workers:write+workers_kv:write+zone:read`
    popupRef.current = window.open(url, 'cf-oauth', 'width=620,height=720,noopener')
  }

  const openInstantOAuth = () => {
    const redirectUri = `${window.location.origin}/auth/instantdb`
    const url = `https://instantdb.com/platform-oauth/start?client_id=YOUR_INSTANT_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&scope=create_app`
    window.open(url, 'instant-oauth', 'width=620,height=720,noopener')
  }

  const canContinue = cfAccountId.trim() !== '' && instantAppId.trim() !== ''

  const handleContinue = async () => {
    setSaving(true)
    try {
      await db.transact(
        db.tx.stores[storeId].update({ cfAccountId: cfAccountId.trim(), instantAppId: instantAppId.trim() })
      )
      onContinue()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">ربط الخدمات</h2>
        <p className="text-sm text-muted-foreground mt-1">
          اربط حساباتك لنشر متجرك تلقائياً
        </p>
      </div>

      {/* Cloudflare card */}
      <ServiceCard
        icon={<CFIcon />}
        name="Cloudflare Workers"
        description="استضافة المتجر على شبكة Cloudflare العالمية"
        connected={cfConnected}
        oauthLabel="ربط Cloudflare"
        onOAuth={openCFOAuth}
        inputValue={cfAccountId}
        inputPlaceholder="CF Account ID"
        inputLabel="أو أدخل معرف الحساب يدوياً"
        onInputChange={(v) => {
          setCfAccountId(v)
          setCfConnected(v.trim() !== '')
        }}
      />

      {/* InstantDB card */}
      <ServiceCard
        icon={<InstantIcon />}
        name="InstantDB"
        description="قاعدة بيانات لحظية لطلبات المتجر"
        connected={instantConnected}
        oauthLabel="ربط InstantDB"
        onOAuth={openInstantOAuth}
        inputValue={instantAppId}
        inputPlaceholder="InstantDB App ID"
        inputLabel="أو أدخل معرف التطبيق يدوياً"
        onInputChange={(v) => {
          setInstantAppId(v)
          setInstantConnected(v.trim() !== '')
        }}
      />

      <button
        onClick={handleContinue}
        disabled={!canContinue || saving}
        className={cn(
          'w-full py-3 rounded-lg font-semibold text-sm transition-colors',
          canContinue && !saving
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {saving ? 'جارٍ الحفظ...' : 'تابع'}
      </button>
    </div>
  )
}

interface ServiceCardProps {
  icon: React.ReactNode
  name: string
  description: string
  connected: boolean
  oauthLabel: string
  onOAuth: () => void
  inputValue: string
  inputPlaceholder: string
  inputLabel: string
  onInputChange: (v: string) => void
}

function ServiceCard({
  icon,
  name,
  description,
  connected,
  oauthLabel,
  onOAuth,
  inputValue,
  inputPlaceholder,
  inputLabel,
  onInputChange,
}: ServiceCardProps) {
  return (
    <div className="border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium shrink-0',
            connected ? 'text-green-600' : 'text-muted-foreground'
          )}
        >
          <span
            className={cn('w-2 h-2 rounded-full', connected ? 'bg-green-500' : 'bg-gray-300')}
          />
          {connected ? 'متصل' : 'غير متصل'}
        </div>
      </div>

      <button
        onClick={onOAuth}
        className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors font-medium"
      >
        {oauthLabel}
      </button>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">{inputLabel}</label>
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 transition-colors"
          placeholder={inputPlaceholder}
          dir="ltr"
        />
      </div>
    </div>
  )
}

function CFIcon() {
  return (
    <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
      <span className="text-white text-xs font-bold">CF</span>
    </div>
  )
}

function InstantIcon() {
  return (
    <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
      <span className="text-white text-xs font-bold">IDB</span>
    </div>
  )
}
