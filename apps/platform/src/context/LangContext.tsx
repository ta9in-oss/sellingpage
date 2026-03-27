import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Lang = 'ar' | 'fr' | 'en'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (obj: Partial<Record<Lang, string>> & { ar: string }) => string
  dir: 'rtl' | 'ltr'
}

const LangContext = createContext<LangCtx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('lang') as Lang) || 'ar'
    }
    return 'ar'
  })

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr'

  const setLang = (l: Lang) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', l)
    setLangState(l)
  }

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [lang, dir])

  // Falls back: en → fr → ar
  const t = (obj: Partial<Record<Lang, string>> & { ar: string }): string =>
    obj[lang] ?? obj['fr'] ?? obj['ar']

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLangContext() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
