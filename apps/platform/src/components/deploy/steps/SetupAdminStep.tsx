import { useState, useEffect } from 'react'
import { db } from '@/lib/instantdb'
import { cn } from '@/lib/utils'
import { UserCheck } from 'lucide-react'

interface Props {
  storeId: string
  onContinue: () => void
}

export function SetupAdminStep({ storeId, onContinue }: Props) {
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
      setError((e as Error).message || 'فشل الحفظ')
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
          <h2 className="text-lg font-bold">مدير المتجر</h2>
          <p className="text-sm text-muted-foreground">
            من سيدير هذا المتجر ويستقبل الطلبات؟
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-muted/60 rounded-xl p-4 text-sm space-y-2 border" dir="rtl">
        <p className="font-semibold">كيف يعمل هذا؟</p>
        <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground text-xs">
          <li>ندخل البريد الإلكتروني لمدير المتجر هنا</li>
          <li>أثناء النشر، نضيف هذا المستخدم تلقائياً لقاعدة بيانات متجرك</li>
          <li>يمكنه تسجيل الدخول في لوحة التحكم برابط سحري على بريده</li>
          <li>من لوحة التحكم، يستطيع إضافة موظفين آخرين</li>
        </ol>
      </div>

      {/* Email input */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">البريد الإلكتروني للمدير</label>
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
          <p className="text-green-600 text-xs">✓ بريد إلكتروني صحيح</p>
        )}
        <p className="text-xs text-muted-foreground">
          سيحتاج هذا الشخص لهذا البريد لتسجيل الدخول في لوحة تحكم المتجر
        </p>
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
        {saving ? 'جارٍ الحفظ...' : 'تابع للنشر'}
      </button>
    </div>
  )
}
