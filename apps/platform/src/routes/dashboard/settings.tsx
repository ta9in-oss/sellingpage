// /dashboard/settings — account-level CF + InstantDB credentials
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { db } from '@/lib/instantdb'
import { Loader2, ArrowLeft, ArrowRight, Save, Key, ExternalLink, Globe, AlertCircle } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { saveMerchantSecrets } from '@/server/saveMerchantSecrets'

export const Route = createFileRoute('/dashboard/settings')({
  validateSearch: (search) => ({
    from: (search.from as string) || undefined,
  }),
  component: SettingsPage,
})

const T = {
  settings: { ar: 'إعدادات الحساب', fr: 'Paramètres du compte', en: 'Account Settings' },
  backToDashboard: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
  cfSection: { ar: 'إعدادات Cloudflare', fr: 'Configuration Cloudflare', en: 'Cloudflare Settings' },
  cfDesc: { ar: 'تُستخدم لنشر متاجرك على Cloudflare Workers', fr: 'Utilisé pour déployer vos boutiques', en: 'Used to deploy your stores on Cloudflare Workers' },
  cfAccountId: { ar: 'معرف الحساب (Account ID)', fr: 'ID de compte', en: 'Account ID' },
  cfApiToken: { ar: 'مفتاح API (API Token)', fr: 'Jeton API', en: 'API Token' },
  instantSection: { ar: 'إعدادات InstantDB', fr: 'Configuration InstantDB', en: 'InstantDB Settings' },
  instantDesc: { ar: 'تُستخدم لإنشاء قواعد بيانات لمتاجرك تلقائياً', fr: 'Utilisé pour créer des bases de données', en: 'Used to auto-create databases for your stores' },
  instantAppId: { ar: 'معرف التطبيق (App ID)', fr: "ID d'application", en: 'App ID' },
  instantAdminToken: { ar: 'رمز الادمن (Admin Token)', fr: 'Jeton admin', en: 'Admin Token' },
  save: { ar: 'حفظ الإعدادات', fr: 'Enregistrer', en: 'Save settings' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  saved: { ar: 'تم الحفظ ✓', fr: 'Enregistré ✓', en: 'Saved ✓' },
  cfDocs: { ar: 'كيف أحصل على هذه البيانات؟', fr: 'Comment obtenir ces informations?', en: 'How do I get these?' },
  requiredNote: { ar: 'هذه الإعدادات مطلوبة لنشر المتاجر', fr: 'Ces paramètres sont requis pour le déploiement', en: 'Required to deploy stores' },
  deployRedirect: { ar: 'لتتمكن من نشر متجرك، يرجى إدخال بيانات Cloudflare أولاً', fr: 'Pour déployer votre boutique, configurez Cloudflare d\'abord', en: 'To deploy your store, please configure Cloudflare first' },
  optional: { ar: 'اختياري', fr: 'optionnel', en: 'optional' },
}

function SettingsPage() {
  const navigate = useNavigate()
  const { t, dir } = useLang()
  const { from } = Route.useSearch()
  const isRtl = dir === 'rtl'
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const { isLoading: authLoading, user } = db.useAuth()

  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null
  )
  const platformUser = (data?.platformUsers ?? [])[0] as any

  const [fields, setFields] = useState({
    cfAccountId: '',
    cfApiToken: '',
    instantAppId: '',
    instantAdminToken: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (platformUser) {
      // Token fields stay blank: they are encrypted at rest and the plaintext
      // never leaves the server. Blank on save means "keep what's stored".
      setFields({
        cfAccountId: platformUser.cfAccountId ?? '',
        cfApiToken: '',
        instantAppId: platformUser.instantAppId ?? '',
        instantAdminToken: '',
      })
    }
  }, [platformUser?.id])

  const handleSave = async () => {
    if (!platformUser?.id) return
    setSaving(true)
    try {
      await saveMerchantSecrets({
        data: {
          platformUserId: platformUser.id,
          cfAccountId: fields.cfAccountId.trim(),
          cfApiToken: fields.cfApiToken.trim() || undefined,
          instantAppId: fields.instantAppId.trim(),
          instantAdminToken: fields.instantAdminToken.trim() || undefined,
        },
      })
      setSaveStatus('saved')
      setTimeout(() => {
        setSaveStatus('idle')
        if (from === 'deploy') navigate({ to: '/dashboard' })
      }, 1500)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir={dir}>
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <BackIcon size={16} />
          {t(T.backToDashboard)}
        </button>

        <h1 className="text-2xl font-bold mb-1">{t(T.settings)}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t(T.requiredNote)}</p>

        {/* Deploy redirect banner */}
        {from === 'deploy' && (
          <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{t(T.deployRedirect)}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Cloudflare */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold flex items-center gap-2">
                  <Key size={16} className="text-primary" />
                  {t(T.cfSection)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{t(T.cfDesc)}</p>
              </div>
              <a
                href="https://dash.cloudflare.com/profile/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink size={12} />
                {t(T.cfDocs)}
              </a>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t(T.cfAccountId)}</label>
                <input
                  type="text"
                  value={fields.cfAccountId}
                  onChange={(e) => setFields((f) => ({ ...f, cfAccountId: e.target.value }))}
                  className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  dir="ltr"
                  placeholder="abc123..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t(T.cfApiToken)}</label>
                <input
                  type="password"
                  value={fields.cfApiToken}
                  onChange={(e) => setFields((f) => ({ ...f, cfApiToken: e.target.value }))}
                  className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>

          {/* InstantDB */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-bold flex items-center gap-2">
                  <Globe size={16} className="text-primary" />
                  {t(T.instantSection)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(T.instantDesc)}{' '}
                  <span className="text-xs opacity-70">({t(T.optional)})</span>
                </p>
              </div>
              <a
                href="https://instantdb.com/dash"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink size={12} />
                {t(T.cfDocs)}
              </a>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t(T.instantAppId)}</label>
                <input
                  type="text"
                  value={fields.instantAppId}
                  onChange={(e) => setFields((f) => ({ ...f, instantAppId: e.target.value }))}
                  className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  dir="ltr"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t(T.instantAdminToken)}</label>
                <input
                  type="password"
                  value={fields.instantAdminToken}
                  onChange={(e) => setFields((f) => ({ ...f, instantAdminToken: e.target.value }))}
                  className="w-full border border-input bg-background rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  dir="ltr"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </section>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !platformUser?.id}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
              saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
              (saving || !platformUser?.id) && 'opacity-60 cursor-not-allowed'
            )}
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" />{t(T.saving)}</>
            ) : saveStatus === 'saved' ? (
              t(T.saved)
            ) : (
              <><Save size={16} />{t(T.save)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
