// /dashboard/whats-new — merchant-facing release notes ("What's new" + changelog).
//
// Subscribers only: the feed is part of what people pay for, so an account with
// no tier is sent back to the dashboard (which shows the pricing gate).
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'
import { RELEASES, KIND_LABEL, type ReleaseKind } from '@/config/releases'

export const Route = createFileRoute('/dashboard/whats-new')({
  component: WhatsNewPage,
})

const T = {
  title: { ar: 'ما الجديد', fr: 'Nouveautés', en: "What's new" },
  subtitle: {
    ar: 'كل ما أضفناه وحسّناه في المنصة والمتاجر. نعمل باستمرار.',
    fr: 'Tout ce que nous ajoutons et améliorons sur la plateforme et les boutiques.',
    en: 'Everything we add and improve across the platform and your stores.',
  },
  back: { ar: 'العودة للوحة التحكم', fr: 'Retour au tableau de bord', en: 'Back to dashboard' },
  republishNote: {
    ar: 'ملاحظة: التحسينات التي تخصّ المتجر تُطبَّق عند إعادة نشر المتجر.',
    fr: 'Note : les améliorations liées à la boutique s\'appliquent après une nouvelle publication.',
    en: 'Note: store-side improvements apply the next time you publish your store.',
  },
  empty: { ar: 'لا توجد تحديثات بعد.', fr: 'Aucune mise à jour pour le moment.', en: 'No updates yet.' },
}

const KIND_STYLE: Record<ReleaseKind, string> = {
  new: 'bg-primary/10 text-primary',
  improved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  fixed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

function WhatsNewPage() {
  const navigate = useNavigate()
  const { t, dir, lang } = useLang()
  const isRtl = dir === 'rtl'
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const { isLoading: authLoading, user } = db.useAuth()

  const { data, isLoading: dataLoading } = db.useQuery(
    user?.email ? { platformUsers: { $: { where: { email: user.email } } } } : null,
  )
  const platformUser = (data?.platformUsers ?? [])[0] as { tier?: string } | undefined

  // Signed out, or signed in without a subscription → back to the dashboard,
  // which is where sign-in and the pricing gate live.
  useEffect(() => {
    if (authLoading || dataLoading) return
    if (!user || !platformUser?.tier) navigate({ to: '/dashboard', replace: true })
  }, [authLoading, dataLoading, user, platformUser?.tier, navigate])

  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!user || !platformUser?.tier) return null

  const dateFmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-DZ' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir={dir}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <BackIcon size={16} />
          {t(T.back)}
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">{t(T.title)}</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{t(T.subtitle)}</p>

        <p className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2.5 mb-6">
          {t(T.republishNote)}
        </p>

        {RELEASES.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t(T.empty)}</p>
        ) : (
          <div className="space-y-6">
            {RELEASES.map((release) => (
              <section key={release.date} className="rounded-2xl border bg-card p-5">
                <p className="text-xs text-muted-foreground font-mono">
                  {dateFmt.format(new Date(release.date))}
                </p>
                <h2 className="font-bold text-lg mt-1 mb-4">{t(release.title)}</h2>
                <ul className="space-y-3">
                  {release.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          'text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5',
                          KIND_STYLE[item.kind],
                        )}
                      >
                        {t(KIND_LABEL[item.kind])}
                      </span>
                      <span className="text-sm leading-relaxed">{t(item.text)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
