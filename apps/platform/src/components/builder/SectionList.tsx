import { useState, useEffect } from 'react'
import { useBuilderStore } from '@/hooks/useBuilderStore'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
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
} from 'lucide-react'
import type { Section } from '@7aba/store-ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'

type SectionType = Section['type']

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'قسم البطل',
  features: 'المميزات',
  testimonials: 'آراء العملاء',
  faq: 'الأسئلة الشائعة',
  guarantee: 'الضمان',
  'order-form': 'نموذج الطلب',
}

const SECTION_ICONS: Record<SectionType, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Sparkles,
  features: LayoutGrid,
  testimonials: MessageSquare,
  faq: HelpCircle,
  guarantee: ShieldCheck,
  'order-form': ClipboardList,
}

const ADDABLE_TYPES: SectionType[] = ['hero', 'features', 'testimonials', 'faq', 'guarantee']

interface SortableSectionCardProps {
  section: Section
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

function SortableSectionCard({ section, isSelected, onSelect, onRemove }: SortableSectionCardProps) {
  const isLocked = section.type === 'order-form'
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    disabled: isLocked,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = SECTION_ICONS[section.type]

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 px-2 py-2 cursor-pointer transition-all mb-1 shadow-none',
        'hover:bg-zinc-50 border',
        isSelected && 'border-s-2 border-s-zinc-900 bg-zinc-50',
        isLocked && 'opacity-75'
      )}
    >
      {!isLocked ? (
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing shrink-0"
          aria-label="سحب"
        >
          <GripVertical size={14} />
        </button>
      ) : (
        <div className="w-[14px] shrink-0" />
      )}

      <Icon size={14} className="text-zinc-500 shrink-0" />
      <span className="flex-1 text-sm font-medium truncate">{SECTION_LABELS[section.type]}</span>

      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 shrink-0">
        {section.type}
      </Badge>

      {!isLocked && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-zinc-300 hover:text-red-500 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label="حذف القسم"
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
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id))
    }
  }

  const sectionCards = config.sections.map((section) => (
    <SortableSectionCard
      key={section.id}
      section={section}
      isSelected={selectedSectionId === section.id}
      onSelect={() => selectSection(section.id)}
      onRemove={() => removeSection(section.id)}
    />
  ))

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-3 border-b border-zinc-200">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">الأقسام</span>
      </div>

      <ScrollArea className="flex-1 p-2">
        {isClient ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={config.sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sectionCards}
            </SortableContext>
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
          إضافة قسم
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
