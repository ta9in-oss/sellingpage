import { useState, useEffect } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Trash2,
  Plus,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ClipboardList,
  Zap,
  Megaphone,
  Star,
} from 'lucide-react'
import type { Section } from '@7aba/store-ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { createPortal } from 'react-dom'
import { useLang } from '@/hooks/useLang'

type SectionType = Section['type']

const SECTION_ICONS: Record<SectionType, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Sparkles,
  features: LayoutGrid,
  testimonials: MessageSquare,
  faq: HelpCircle,
  guarantee: ShieldCheck,
  'order-form': ClipboardList,
  'social-proof': Zap,
  cta: Megaphone,
  benefits: Star,
}

const ADDABLE_TYPES: SectionType[] = ['hero', 'features', 'testimonials', 'faq', 'guarantee', 'order-form', 'social-proof', 'cta', 'benefits']

const T = {
  sections: { ar: 'الأقسام', fr: 'Sections', en: 'Sections' },
  noSections: { ar: 'لا توجد أقسام. أضف قسمًا.', fr: 'Aucune section. Ajoutez-en une.', en: 'No sections. Add one.' },
  drag: { ar: 'سحب', fr: 'Glisser', en: 'Drag' },
  deleteSection: { ar: 'حذف القسم', fr: 'Supprimer la section', en: 'Delete section' },
  addSection: { ar: 'إضافة قسم', fr: 'Ajouter une section', en: 'Add section' },
  sectionHero: { ar: 'قسم البطل', fr: 'Section héros', en: 'Hero section' },
  sectionFeatures: { ar: 'المميزات', fr: 'Fonctionnalités', en: 'Features' },
  sectionTestimonials: { ar: 'آراء العملاء', fr: 'Avis clients', en: 'Testimonials' },
  sectionFaq: { ar: 'الأسئلة الشائعة', fr: 'FAQ', en: 'FAQ' },
  sectionGuarantee: { ar: 'الضمان', fr: 'Garantie', en: 'Guarantee' },
  sectionOrderForm: { ar: 'نموذج الطلب', fr: 'Formulaire de commande', en: 'Order form' },
}

interface SortableSectionCardProps {
  section: Section
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  isDragOverlay?: boolean
  sectionLabels: Record<SectionType, string>
  dragLabel: string
  deleteLabel: string
}

function SortableSectionCard({
  section,
  isSelected,
  onSelect,
  onRemove,
  isDragOverlay = false,
  sectionLabels,
  dragLabel,
  deleteLabel,
}: SortableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragOverlay ? undefined : transition,
    opacity: isDragging && !isDragOverlay ? 0.3 : 1,
  }

  const Icon = SECTION_ICONS[section.type] ?? LayoutGrid

  return (
    <Card
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      onClick={isDragOverlay ? undefined : onSelect}
      className={cn(
        'flex items-center gap-2 px-2 py-2 cursor-pointer transition-all mb-1 shadow-none select-none',
        'hover:bg-zinc-50 border',
        isSelected && !isDragOverlay && 'border-s-2 border-s-zinc-900 bg-zinc-50',
        isDragOverlay && 'shadow-xl border-2 border-black bg-yellow-50 rotate-1 scale-105 cursor-grabbing'
      )}
    >
      <button
        {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'text-zinc-300 hover:text-zinc-600 shrink-0 cursor-grab active:cursor-grabbing',
          isDragOverlay && 'cursor-grabbing text-zinc-600'
        )}
        aria-label={dragLabel}
      >
        <GripVertical size={14} />
      </button>

      <Icon size={14} className="text-zinc-500 shrink-0" />
      <span className="flex-1 text-sm font-medium truncate">{sectionLabels[section.type]}</span>

      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
        {section.type}
      </Badge>

      {!isDragOverlay && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-zinc-300 hover:text-red-500 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={deleteLabel}
        >
          <Trash2 size={13} />
        </Button>
      )}
    </Card>
  )
}

export function SectionList() {
  const { config, selectedSectionId, selectSection, removeSection, reorderSections, addSection } =
    useBuilderStore()
  const { t } = useLang()
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const SECTION_LABELS: Record<SectionType, string> = {
    hero: t(T.sectionHero),
    features: t(T.sectionFeatures),
    testimonials: t(T.sectionTestimonials),
    faq: t(T.sectionFaq),
    guarantee: t(T.sectionGuarantee),
    'order-form': t(T.sectionOrderForm),
    'social-proof': t({ ar: 'شريط الثقة', fr: 'Barre de confiance', en: 'Social Proof' }),
    cta: t({ ar: 'الدعوة للعمل', fr: 'Appel à l\'action', en: 'Call to Action' }),
    benefits: t({ ar: 'الفوائد', fr: 'Avantages', en: 'Benefits' }),
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id))
    }
  }

  const activeSection = activeId ? config.sections.find((s) => s.id === activeId) : null

  const sectionCards = config.sections.map((section) => (
    <SortableSectionCard
      key={section.id}
      section={section}
      isSelected={selectedSectionId === section.id}
      onSelect={() => selectSection(section.id)}
      onRemove={() => removeSection(section.id)}
      sectionLabels={SECTION_LABELS}
      dragLabel={t(T.drag)}
      deleteLabel={t(T.deleteSection)}
    />
  ))

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-zinc-200">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{t(T.sections)}</span>
      </div>

      <ScrollArea className="flex-1 p-2">
        {config.sections.length === 0 && (
          <p className="text-xs text-zinc-400 text-center py-4">{t(T.noSections)}</p>
        )}
        {isClient ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={config.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sectionCards}
            </SortableContext>

            {createPortal(
              <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
                {activeSection && (
                  <SortableSectionCard
                    section={activeSection}
                    isSelected={false}
                    onSelect={() => {}}
                    onRemove={() => {}}
                    isDragOverlay
                    sectionLabels={SECTION_LABELS}
                    dragLabel={t(T.drag)}
                    deleteLabel={t(T.deleteSection)}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        ) : (
          sectionCards
        )}
      </ScrollArea>

      <div className="p-2 border-t border-zinc-200 relative">
        <Button
          onClick={() => setShowAddMenu((v) => !v)}
          className="w-full gap-2"
          size="sm"
        >
          <Plus size={14} />
          {t(T.addSection)}
        </Button>

        {showAddMenu && (
          <Card className="absolute bottom-full left-2 right-2 mb-1 z-10 overflow-hidden shadow-lg p-1">
            {ADDABLE_TYPES.map((type) => {
              const Icon = SECTION_ICONS[type]
              return (
                <button
                  key={type}
                  onClick={() => {
                    addSection(type)
                    setShowAddMenu(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-zinc-50 transition-colors"
                >
                  <Icon size={14} className="text-zinc-500" />
                  {SECTION_LABELS[type]}
                </button>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}
