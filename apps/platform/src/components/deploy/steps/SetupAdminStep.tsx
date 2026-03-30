import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { UserCheck } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

interface Props {
  storeId: string
  onContinue: () => void
}

const T = {
  storeAdmin: { ar: 'مدير المتجر', fr: 'Admin de la boutique', en: 'Store admin' },
  storeAdminDesc: { ar: 'من سيدير هذا المتجر ويستقبل الطلبات؟', fr: 'Qui gérera cette boutique et recevra les commandes ?', en: 'Who will manage this store and receive orders?' },
  howItWorksTitle: { ar: 'كيف يعمل هذا؟', fr: 'Comment ça fonctionne ?', en: 'How does this work?' },
  howItStep1: { ar: 'ندخل البريد الإلكتروني لمدير المتجر هنا', fr: 'Nous entrons l\'e-mail de l\'administrateur ici', en: 'We enter the store admin email here' },
  howItStep2: { ar: 'أثناء النشر، نضيف هذا المستخدم تلقائياً لقاعدة بيانات متجرك', fr: 'Lors du déploiement, cet utilisateur est ajouté automatiquement à la base de données', en: 'During deployment, this user is automatically added to your store\'s database' },
  howItStep3: { ar: 'يمكنه تسجيل الدخول في لوحة التحكم برابط سحري على بريده', fr: 'Il peut se connecter au tableau de bord via un lien magique envoyé par e-mail', en: 'They can log in to the dashboard via a magic link sent to their email' },
  howItStep4: { ar: 'من لوحة التحكم، يستطيع إضافة موظفين آخرين', fr: 'Depuis le tableau de bord, il peut ajouter d\'autres employés', en: 'From the dashboard, they can add other staff members' },
  adminEmail: { ar: 'البريد الإلكتروني للمدير', fr: 'E-mail de l\'administrateur', en: 'Admin email' },
  validEmail: { ar: '✓ بريد إلكتروني صحيح', fr: '✓ Adresse e-mail valide', en: '✓ Valid email address' },
  emailHint: { ar: 'سيحتاج هذا الشخص لهذا البريد لتسجيل الدخول في لوحة تحكم المتجر', fr: 'Cette personne aura besoin de cet e-mail pour se connecter au tableau de bord', en: 'This person will need this email to log into the store dashboard' },
  saving: { ar: 'جارٍ الحفظ...', fr: 'Enregistrement...', en: 'Saving...' },
  continueToDeployment: { ar: 'تابع للنشر', fr: 'Continuer vers le déploiement', en: 'Continue to deployment' },
  saveFailed: { ar: 'فشل الحفظ', fr: 'Échec de l\'enregistrement', en: 'Save failed' },
}

export function SetupAdminStep({ storeId, onContinue }: Props) {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { data: storeData } = db.useQuery({
    stores: { $: { where: { id: storeId } } },
  })

  // Hydrate from existing store data
  useEffect(() => {
    const adminEmail = storeData?.stores?.[0]?.adminEmail
    if (adminEmail) setEmail(adminEmail)
  }, [storeData])

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleContinue = async () => {
    if (!isValidEmail) return
    setSaving(true)
    setError('')
    try {
      await db.transact(
        db.tx.stores[storeId].update({ adminEmail: email.trim().toLowerCase() })
      )
      onContinue()
    } catch (e: unknown) {
      setError((e as Error).message || t(T.saveFailed))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <UserCheck size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{t(T.storeAdmin)}</h2>
          <p className="text-sm text-muted-foreground">{t(T.storeAdminDesc)}</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-muted/60 rounded-xl p-4 text-sm space-y-2 border" dir="rtl">
        <p className="font-semibold">{t(T.howItWorksTitle)}</p>
        <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground text-xs">
          <li>{t(T.howItStep1)}</li>
          <li>{t(T.howItStep2)}</li>
          <li>{t(T.howItStep3)}</li>
          <li>{t(T.howItStep4)}</li>
        </ol>
      </div>

      {/* Email input */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">{t(T.adminEmail)}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          placeholder="admin@example.com"
          dir="ltr"
          className={cn(
            'w-full px-3 py-2.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 transition-colors',
            error ? 'border-destructive focus:ring-destructive/30' : 'focus:ring-ring/30'
          )}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
        {isValidEmail && !error && (
          <p className="text-green-600 text-xs">{t(T.validEmail)}</p>
        )}
        <p className="text-xs text-muted-foreground">{t(T.emailHint)}</p>
      </div>

      <button
        onClick={handleContinue}
        disabled={!isValidEmail || saving}
        className={cn(
          'w-full py-3 rounded-lg font-semibold text-sm transition-colors',
          isValidEmail && !saving
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        {saving ? t(T.saving) : t(T.continueToDeployment)}
      </button>
    </div>
  )
}
