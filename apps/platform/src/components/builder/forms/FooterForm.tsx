import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLang } from '@/hooks/useLang'

const T = {
  title: { ar: 'تذييل الصفحة', fr: 'Pied de page', en: 'Footer' },
  storeName: { ar: 'اسم المتجر', fr: 'Nom du magasin', en: 'Store name' },
  tagline: { ar: 'الشعار', fr: 'Slogan', en: 'Tagline' },
  phone: { ar: 'رقم الهاتف', fr: 'Téléphone', en: 'Phone' },
  email: { ar: 'البريد الإلكتروني', fr: 'Email', en: 'Email' },
  whatsapp: { ar: 'واتساب', fr: 'WhatsApp', en: 'WhatsApp' },
  copyright: { ar: 'حقوق النشر', fr: 'Copyright', en: 'Copyright' },
  phonePlaceholder: { ar: '+213 ...' , fr: '+213 ...', en: '+213 ...' },
  whatsappPlaceholder: { ar: '213XXXXXXXXX', fr: '213XXXXXXXXX', en: '213XXXXXXXXX' },
}

interface FooterFormProps {
  sectionId: string
}

export function FooterForm({ sectionId }: FooterFormProps) {
  const { config, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'

  const section = config.sections.find((s) => s.id === sectionId) as any
  if (!section) return null

  const update = (patch: object) => updateSection(sectionId, patch)

  return (
    <div className="space-y-4" dir={dir}>
      <h3 className="font-semibold text-sm">{t(T.title)}</h3>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.storeName)}</Label>
        <Input
          dir={storeDir}
          value={section.storeName ?? ''}
          onChange={(e) => update({ storeName: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.tagline)}</Label>
        <Input
          dir={storeDir}
          value={section.tagline ?? ''}
          onChange={(e) => update({ tagline: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.phone)}</Label>
        <Input
          dir="ltr"
          value={section.phone ?? ''}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder={t(T.phonePlaceholder)}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.whatsapp)}</Label>
        <Input
          dir="ltr"
          value={section.whatsapp ?? ''}
          onChange={(e) => update({ whatsapp: e.target.value })}
          placeholder={t(T.whatsappPlaceholder)}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.email)}</Label>
        <Input
          dir="ltr"
          value={section.email ?? ''}
          onChange={(e) => update({ email: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.copyright)}</Label>
        <Input
          dir={storeDir}
          value={section.copyright ?? ''}
          onChange={(e) => update({ copyright: e.target.value })}
          className="text-sm"
        />
      </div>
    </div>
  )
}
