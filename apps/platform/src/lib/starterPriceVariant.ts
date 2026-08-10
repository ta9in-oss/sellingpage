import { STARTER_PRICE_VARIANTS, STARTER_VARIANT_WEIGHTS } from '@/config/pricing'

const STORAGE_KEY = '7aba_starter_price_variant'

function pickWeighted(): number {
  const total = STARTER_PRICE_VARIANTS.reduce((sum, v) => sum + STARTER_VARIANT_WEIGHTS[v], 0)
  let r = Math.random() * total
  for (const v of STARTER_PRICE_VARIANTS) {
    r -= STARTER_VARIANT_WEIGHTS[v]
    if (r <= 0) return v
  }
  return STARTER_PRICE_VARIANTS[STARTER_PRICE_VARIANTS.length - 1]
}

/**
 * Same visitor must always see (and pay) the same starter price — assigned
 * once on first read, persisted in localStorage, reused everywhere the
 * starter price is shown or charged (landing pricing, checkout gate, the
 * pixel events fired at each step).
 */
export function getStarterPriceVariant(): number {
  if (typeof window === 'undefined') return STARTER_PRICE_VARIANTS[1]
  const stored = Number(window.localStorage.getItem(STORAGE_KEY))
  if ((STARTER_PRICE_VARIANTS as readonly number[]).includes(stored)) return stored
  const chosen = pickWeighted()
  window.localStorage.setItem(STORAGE_KEY, String(chosen))
  return chosen
}
