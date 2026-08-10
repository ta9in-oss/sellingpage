/** Meta (Facebook) Pixel — fire standard events from the purchase flow. */
export function trackPixel(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
  if (typeof fbq === 'function') fbq('track', event, data)
}

/** Non-standard events (e.g. checkout abandonment) — Meta only recognizes these via `trackCustom`. */
export function trackPixelCustom(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
  if (typeof fbq === 'function') fbq('trackCustom', event, data)
}
