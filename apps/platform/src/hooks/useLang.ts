import { useState } from 'react'

export function useLang() {
  const [lang, setLang] = useState<'ar' | 'fr'>(() =>
    (typeof localStorage !== 'undefined'
      ? (localStorage.getItem('lang') as 'ar' | 'fr')
      : null) || 'ar'
  )
  const toggle = () => {
    const next = lang === 'ar' ? 'fr' : 'ar'
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', next)
    if (typeof document !== 'undefined') {
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = next
    }
    setLang(next)
  }
  return { lang, toggle, t: (obj: { ar: string; fr: string }) => obj[lang] }
}
