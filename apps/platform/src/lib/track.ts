/** GA4 (gtag) and Clarity custom events — siblings of trackPixel in ./pixel. */

export function trackGtag(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
  if (typeof gtag === 'function') gtag('event', event, params)
}

export function trackClarity(event: string) {
  if (typeof window === 'undefined') return
  const clarity = (window as unknown as { clarity?: (...a: unknown[]) => void }).clarity
  if (typeof clarity === 'function') clarity('event', event)
}
