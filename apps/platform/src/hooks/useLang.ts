import { useLangContext, type Lang } from '@/context/LangContext'

export type { Lang }

export function useLang() {
  const { lang, setLang, t, dir } = useLangContext()

  const toggle = () => {
    const order: Lang[] = ['ar', 'fr', 'en']
    const next = order[(order.indexOf(lang) + 1) % order.length]
    setLang(next)
  }

  return { lang, setLang, toggle, t, dir }
}
