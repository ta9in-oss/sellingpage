import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { StoreConfig, Section, Theme } from '@7aba/store-ui'
import { brutalistTheme } from '@7aba/store-ui'

interface BuilderState {
  config: StoreConfig
  selectedSectionId: string | null
  isSaving: boolean
  storeId: string | null
}

interface BuilderActions {
  selectSection: (id: string | null) => void
  updateSection: (id: string, patch: Record<string, unknown>) => void
  addSection: (type: Section['type']) => void
  removeSection: (id: string) => void
  reorderSections: (activeId: string, overId: string) => void
  updateTheme: (theme: Theme) => void
  updateMeta: (patch: Partial<StoreConfig['meta']>) => void
  updateProduct: (patch: Partial<StoreConfig['product']>) => void
  updateNotifications: (patch: Partial<StoreConfig['notifications']>) => void
  saveToInstantDB: (storeId: string, db: any) => void
  hydrateConfig: (config: StoreConfig) => void
}

const defaultConfig: StoreConfig = {
  meta: {
    name: 'متجري',
    slug: '',
    locale: 'ar',
    rtl: true,
  },
  theme: brutalistTheme,
  sections: [
    {
      id: nanoid(),
      type: 'hero',
      headline: 'اسم منتجك هنا',
      subheadline: 'صف منتجك في جملة أو جملتين. اجذب انتباه الزبون وبين له الفائدة.',
      cta: 'اطلب الآن',
      image: '',
    },
    {
      id: nanoid(),
      type: 'order-form',
      submitLabel: 'أكّد الطلب',
      fields: [
        { id: nanoid(), label: 'الاسم الكامل', type: 'text', required: true },
        { id: nanoid(), label: 'رقم الهاتف', type: 'phone', required: true },
      ],
    },
  ],
  product: {
    name: 'منتجي',
    price: 2500,
    currency: 'DZD',
    images: [],
  },
  notifications: {
    enabled: true,
    message: 'شخص طلب للتو!',
  },
}

function createDefaultSection(type: Section['type']): Section {
  switch (type) {
    case 'hero':
      return {
        id: nanoid(),
        type: 'hero',
        headline: 'عنوان القسم الجديد',
        subheadline: 'صف منتجك هنا بشكل جذاب',
        cta: 'اطلب الآن',
        image: '',
      }
    case 'features':
      return {
        id: nanoid(),
        type: 'features',
        items: [
          { icon: '⭐', title: 'جودة عالية', body: 'منتج مصنوع من أفضل المواد' },
          { icon: '🚀', title: 'توصيل سريع', body: 'يصلك خلال 2 إلى 5 أيام' },
          { icon: '💯', title: 'ضمان استرداد', body: 'ضمان استرداد كامل خلال 7 أيام' },
        ],
      }
    case 'testimonials':
      return {
        id: nanoid(),
        type: 'testimonials',
        items: [
          { name: 'أحمد بن علي', text: 'منتج رائع جداً! جودة ممتازة وتوصيل سريع', rating: 5 },
          { name: 'فاطمة الزهراء', text: 'راضية بزاف، ننصح بيه لكل الناس', rating: 5 },
          { name: 'محمد الأمين', text: 'المنتج كيما في الصور، ما خيبش الظن', rating: 5 },
        ],
      }
    case 'faq':
      return {
        id: nanoid(),
        type: 'faq',
        items: [
          { q: 'كيفاش نطلب؟', a: 'اكتب معلوماتك في الاستمارة وانتظر التأكيد.' },
          { q: 'واش التوصيل مجاني؟', a: 'إيه! التوصيل مجاني لكامل الوطن.' },
          { q: 'كيفاش الدفع؟', a: 'الدفع عند الاستلام فقط.' },
        ],
      }
    case 'guarantee':
      return {
        id: nanoid(),
        type: 'guarantee',
        items: [
          { icon: 'truck', title: 'توصيل مجاني', description: 'توصيل مجاني لجميع الولايات' },
          { icon: 'refresh', title: 'إرجاع مجاني', description: 'عندك 7 أيام باش ترجع المنتج' },
          { icon: 'shield', title: 'ضمان الجودة', description: 'ضمان استرداد الأموال خلال 7 أيام' },
        ],
      }
    case 'order-form':
      return {
        id: nanoid(),
        type: 'order-form',
        submitLabel: 'أكّد الطلب',
        fields: [
          { id: nanoid(), label: 'الاسم الكامل', type: 'text', required: true },
          { id: nanoid(), label: 'رقم الهاتف', type: 'phone', required: true },
        ],
      }
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  config: defaultConfig,
  selectedSectionId: null,
  isSaving: false,
  storeId: null,

  selectSection: (id) => set({ selectedSectionId: id }),

  updateSection: (id, patch) =>
    set((state) => ({
      config: {
        ...state.config,
        sections: state.config.sections.map((s) =>
          s.id === id ? ({ ...s, ...patch } as Section) : s
        ),
      },
    })),

  addSection: (type) => {
    const newSection = createDefaultSection(type)
    set((state) => {
      const sections = [...state.config.sections]
      const orderFormIndex = sections.findIndex((s) => s.type === 'order-form')
      if (orderFormIndex !== -1) {
        sections.splice(orderFormIndex, 0, newSection)
      } else {
        sections.push(newSection)
      }
      return { config: { ...state.config, sections } }
    })
  },

  removeSection: (id) =>
    set((state) => {
      const section = state.config.sections.find((s) => s.id === id)
      if (section?.type === 'order-form') return state
      return {
        config: {
          ...state.config,
          sections: state.config.sections.filter((s) => s.id !== id),
        },
        selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      }
    }),

  reorderSections: (activeId, overId) =>
    set((state) => {
      const sections = [...state.config.sections]
      const activeIndex = sections.findIndex((s) => s.id === activeId)
      const overIndex = sections.findIndex((s) => s.id === overId)
      if (activeIndex === -1 || overIndex === -1) return state
      if (sections[activeIndex].type === 'order-form') return state
      const orderFormIndex = sections.findIndex((s) => s.type === 'order-form')
      if (orderFormIndex !== -1 && overIndex >= orderFormIndex) return state
      const [moved] = sections.splice(activeIndex, 1)
      sections.splice(overIndex, 0, moved)
      return { config: { ...state.config, sections } }
    }),

  updateTheme: (theme) =>
    set((state) => ({ config: { ...state.config, theme } })),

  updateMeta: (patch) =>
    set((state) => ({
      config: { ...state.config, meta: { ...state.config.meta, ...patch } },
    })),

  updateProduct: (patch) =>
    set((state) => ({
      config: { ...state.config, product: { ...state.config.product, ...patch } },
    })),

  updateNotifications: (patch) =>
    set((state) => ({
      config: { ...state.config, notifications: { ...state.config.notifications, ...patch } },
    })),

  saveToInstantDB: (storeId, db) => {
    if (saveTimer) clearTimeout(saveTimer)
    set({ isSaving: true })
    saveTimer = setTimeout(async () => {
      try {
        const config = get().config
        await db.transact(db.tx.stores[storeId].update({ config }))
        set({ isSaving: false, storeId })
      } catch {
        set({ isSaving: false })
      }
    }, 800)
  },

  hydrateConfig: (config) => set({ config }),
}))
