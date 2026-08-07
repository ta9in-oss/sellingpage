/**
 * Facebook/Instagram in-app webviews are the main friction point for Google
 * sign-in from the FB ad (Google blocks OAuth inside them, and the webview
 * doesn't share the visitor's real Chrome session/cookies). Meta gives
 * advertisers no setting to force links open externally — it's a per-user
 * toggle inside their app — so the fix has to live on our side: detect the
 * webview and offer a real way out.
 */
export function detectInAppBrowser(ua: string): 'facebook' | 'instagram' | null {
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return 'facebook'
  if (/Instagram/.test(ua)) return 'instagram'
  return null
}

export function isAndroid(ua: string): boolean {
  return /Android/.test(ua)
}

/** Android only — Chrome can be launched directly out of a webview via an intent URL. */
export function androidChromeIntentUrl(currentUrl: string): string {
  const { host, pathname, search } = new URL(currentUrl)
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;end;`
}
