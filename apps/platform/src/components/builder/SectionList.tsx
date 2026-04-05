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
  Layers,
  Images,
  Baseline,
} from 'lucide-react'
import type { Section } from '@7aba/store-ui'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  'value-stack': Layers,
  'product-carousel': Images,
  footer: Baseline,
}

const ADDABLE_TYPES: SectionType[] = [
  'hero', 'features', 'testimonials', 'faq', 'guarantee',
  'order-form', 'social-proof', 'cta', 'benefits',
  'value-stack', 'product-carousel', 'footer',
]

const T = {
  sections: { ar: 'الأقسام', fr: 'Sections', en: 'Sections' },
  noSections: { ar: 'لا توجد أقسام', fr: 'Aucune section', en: 'No sections' },
  addSection: { ar: 'إضافة قسم', fr: 'Ajouter une section', en: 'Add section' },
  addAbove: { ar: 'إضافة فوق', fr: 'Ajouter au-dessus', en: 'Add above' },
  addBelow: { ar: 'إضافة تحت', fr: 'Ajouter en-dessous', en: 'Add below' },
  deleteSection: { ar: 'حذف', fr: 'Supprimer', en: 'Delete' },
  sectionHero: { ar: 'قسم البطل', fr: 'Section héros', en: 'Hero' },
  sectionFeatures: { ar: 'المميزات', fr: 'Fonctionnalités', en: 'Features' },
  sectionTestimonials: { ar: 'آراء العملاء', fr: 'Avis clients', en: 'Testimonials' },
  sectionFaq: { ar: 'أسئلة شائعة', fr: 'FAQ', en: 'FAQ' },
  sectionGuarantee: { ar: 'الضمان', fr: 'Garantie', en: 'Guarantee' },
  sectionOrderForm: { ar: 'نموذج الطلب', fr: 'Formulaire', en: 'Order form' },
  sectionSocialProof: { ar: 'إثبات اجتماعي', fr: 'Preuve sociale', en: 'Social proof' },
  sectionCta: { ar: 'دعوة للعمل', fr: 'CTA', en: 'CTA' },
  sectionBenefits: { ar: 'المزايا', fr: 'Avantages', en: 'Benefits' },
  sectionValueStack: { ar: 'قيمة المنتج', fr: 'Valeur produit', en: 'Value stack' },
  sectionProductCarousel: { ar: 'صور المنتج', fr: 'Carrousel', en: 'Carousel' },
  sectionFooter: { ar: 'الذيل', fr: 'Pied de page', en: 'Footer' },
}

// Section type picker rendered inside a DropdownMenuContent
function SectionPickerItems({
  onPick,
  sectionLabels,
}: {
  onPick: (type: SectionType) => void
  sectionLabels: Record<SectionType, string>
}) {
  return (
    <>
      {ADDABLE_TYPES.map((type) => {
        const Icon = SECTION_ICONS[type]
        return (
          <DropdownMenuItem
            key={type}
            onClick={() => onPick(type)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Icon size={14} className="text-muted-foreground shrink-0" />
            <span>{sectionLabels[type]}</span>
          </DropdownMenuItem>
        )
      })}
    </>
  )
}

interface CardProps {
  section: Section
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onAddAbove: (type: SectionType) => void
  onAddBelow: (type: SectionType) => void
  isDragOverlay?: boolean
  sectionLabels: Record<SectionType, string>
}

function SortableSectionCard({
  section,
  isSelected,
  onSelect,
  onRemove,
  onAddAbove,
  onAddBelow,
  isDragOverlay = false,
  sectionLabels,
}: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragOverlay ? undefined : transition,
    opacity: isDragging && !isDragOverlay ? 0.3 : 1,
  }

  const Icon = SECTION_ICONS[section.type] ?? LayoutGrid

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      className="group/card relative"
    >
      {/* Add-above button — centered above card, shown on hover */}
      {!isDragOverlay && (
        <div className="absolute -top-3 inset-x-0 flex justify-center z-20 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Plus size={10} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <SectionPickerItems onPick={onAddAbove} sectionLabels={sectionLabels} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Main card row */}
      <div
        onClick={isDragOverlay ? undefined : onSelect}
        className={cn(
          'flex items-center gap-1.5 px-2 py-2 rounded-md border border-transparent transition-colors cursor-pointer',
          'hover:bg-accent',
          isSelected && !isDragOverlay && 'bg-accent border-border',
          isDragOverlay && 'bg-accent border-border shadow-lg scale-105 rotate-1 cursor-grabbing',
        )}
      >
        {/* Grip handle */}
        <button
          {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            'text-muted-foreground/40 hover:text-muted-foreground shrink-0 cursor-grab active:cursor-grabbing touch-none',
            isDragOverlay && 'cursor-grabbing',
          )}
          tabIndex={-1}
          aria-hidden
        >
          <GripVertical size={14} />
        </button>

        <Icon size={13} className="text-muted-foreground shrink-0" />

        <span className="flex-1 text-xs font-medium truncate">
          {sectionLabels[section.type]}
        </span>

        {/* Delete — hover-only */}
        {!isDragOverlay && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground/0 group-hover/card:text-muted-foreground hover:text-destructive! hover:bg-transparent transition-colors"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            tabIndex={-1}
          >
            <Trash2 size={12} />
          </Button>
        )}
      </div>

      {/* Add-below button — centered below card, shown on hover */}
      {!isDragOverlay && (
        <div className="absolute -bottom-3 inset-x-0 flex justify-center z-20 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Plus size={10} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <SectionPickerItems onPick={onAddBelow} sectionLabels={sectionLabels} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export function SectionList() {
  const { config, selectedSectionId, selectSection, removeSection, reorderSections, addSectionAt } =
    useBuilderStore()
  const { t, dir } = useLang()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const SECTION_LABELS: Record<SectionType, string> = {
    hero: t(T.sectionHero),
    features: t(T.sectionFeatures),
    testimonials: t(T.sectionTestimonials),
    faq: t(T.sectionFaq),
    guarantee: t(T.sectionGuarantee),
    'order-form': t(T.sectionOrderForm),
    'social-proof': t(T.sectionSocialProof),
    cta: t(T.sectionCta),
    benefits: t(T.sectionBenefits),
    'value-stack': t(T.sectionValueStack),
    'product-carousel': t(T.sectionProductCarousel),
    footer: t(T.sectionFooter),
  }

  useEffect(() => setIsClient(true), [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (over && active.id !== over.id) reorderSections(String(active.id), String(over.id))
  }

  const activeSection = activeId ? config.sections.find((s) => s.id === activeId) : null

  const cards = config.sections.map((section, index) => (
    <SortableSectionCard
      key={section.id}
      section={section}
      isSelected={selectedSectionId === section.id}
      onSelect={() => selectSection(section.id)}
      onRemove={() => removeSection(section.id)}
      onAddAbove={(type) => addSectionAt(type, index === 0 ? null : config.sections[index - 1].id)}
      onAddBelow={(type) => addSectionAt(type, section.id)}
      sectionLabels={SECTION_LABELS}
    />
  ))

  return (
    <div className="flex flex-col h-full" dir={dir}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t(T.sections)}
        </span>
      </div>

      {/* Scrollable section list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-3">
        {config.sections.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">{t(T.noSections)}</p>
        )}

        {isClient ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={config.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {cards}
            </SortableContext>

            {createPortal(
              <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
                {activeSection && (
                  <SortableSectionCard
                    section={activeSection}
                    isSelected={false}
                    onSelect={() => {}}
                    onRemove={() => {}}
                    onAddAbove={() => {}}
                    onAddBelow={() => {}}
                    isDragOverlay
                    sectionLabels={SECTION_LABELS}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        ) : (
          cards
        )}
      </div>

      {/* Sticky footer: Add section */}
      <div className="p-2 border-t border-border shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Plus size={14} />
              {t(T.addSection)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center" className="w-52">
            <SectionPickerItems
              onPick={(type) =>
                addSectionAt(
                  type,
                  config.sections.length > 0
                    ? config.sections[config.sections.length - 1].id
                    : null
                )
              }
              sectionLabels={SECTION_LABELS}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
