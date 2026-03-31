import { useBuilderStore } from '@/hooks/useBuilderStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

const T = {
  title: { ar: 'قيمة المنتج', fr: 'Valeur produit', en: 'Value Stack' },
  ctaText: { ar: 'نص الزر', fr: 'Texte du bouton', en: 'Button text' },
  items: { ar: 'العناصر', fr: 'Éléments', en: 'Items' },
  itemTitle: { ar: 'العنوان', fr: 'Titre', en: 'Title' },
  itemDesc: { ar: 'الوصف', fr: 'Description', en: 'Description' },
  itemValue: { ar: 'القيمة', fr: 'Valeur', en: 'Value' },
  itemIcon: { ar: 'الأيقونة', fr: 'Icône', en: 'Icon' },
  isFree: { ar: 'مجاني', fr: 'Gratuit', en: 'Free' },
  addItem: { ar: 'إضافة عنصر', fr: 'Ajouter un élément', en: 'Add item' },
  removeItem: { ar: 'حذف', fr: 'Supprimer', en: 'Remove' },
}

interface ValueStackFormProps {
  sectionId: string
}

export function ValueStackForm({ sectionId }: ValueStackFormProps) {
  const { config, updateSection } = useBuilderStore()
  const { t, dir } = useLang()
  const storeDir = config.meta.rtl ? 'rtl' : 'ltr'

  const section = config.sections.find((s) => s.id === sectionId) as any
  if (!section) return null

  const items = section.items ?? []

  const update = (patch: object) => updateSection(sectionId, patch)

  const updateItem = (index: number, field: string, value: string | boolean) => {
    const newItems = items.map((item: any, i: number) =>
      i === index ? { ...item, [field]: value } : item
    )
    update({ items: newItems })
  }

  const addItem = () => {
    update({
      items: [
        ...items,
        { icon: 'gift', title: '', description: '', value: '', isFree: false },
      ],
    })
  }

  const removeItem = (index: number) => {
    update({ items: items.filter((_: any, i: number) => i !== index) })
  }

  return (
    <div className="space-y-4" dir={dir}>
      <h3 className="font-semibold text-sm">{t(T.title)}</h3>

      <div className="space-y-1">
        <Label className="text-xs">{t(T.ctaText)}</Label>
        <Input
          dir={storeDir}
          value={section.ctaText ?? ''}
          onChange={(e) => update({ ctaText: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs">{t(T.items)}</Label>
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="border rounded-md p-3 space-y-2 bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">#{index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
              >
                <Trash2 size={12} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">{t(T.itemIcon)}</Label>
                <Input
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  placeholder="package, gift, shield..."
                  className="text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">{t(T.itemValue)}</Label>
                <Input
                  dir={storeDir}
                  value={item.value ?? ''}
                  onChange={(e) => updateItem(index, 'value', e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">{t(T.itemTitle)}</Label>
              <Input
                dir={storeDir}
                value={item.title ?? ''}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">{t(T.itemDesc)}</Label>
              <Input
                dir={storeDir}
                value={item.description ?? ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="text-xs"
              />
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={!!item.isFree}
                onChange={(e) => updateItem(index, 'isFree', e.target.checked)}
              />
              {t(T.isFree)}
            </label>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full text-xs gap-1">
          <Plus size={12} />
          {t(T.addItem)}
        </Button>
      </div>
    </div>
  )
}
