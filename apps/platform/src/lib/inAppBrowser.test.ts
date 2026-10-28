import { describe, it, expect } from 'vitest'
import { detectInAppBrowser, isAndroid, androidChromeIntentUrl } from './inAppBrowser'

const FB_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.0;]'
const FB_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/440.0]'
const IG_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0'
const CHROME_ANDROID =
  'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
const SAFARI_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

describe('detectInAppBrowser', () => {
  it('detects the Facebook webview on Android and iOS', () => {
    expect(detectInAppBrowser(FB_ANDROID)).toBe('facebook')
    expect(detectInAppBrowser(FB_IOS)).toBe('facebook')
  })

  it('detects the Instagram webview', () => {
    expect(detectInAppBrowser(IG_IOS)).toBe('instagram')
  })

  it('prefers facebook when a UA carries both markers', () => {
    expect(detectInAppBrowser(`${IG_IOS} FBAV/1`)).toBe('facebook')
  })

  it('returns null for regular browsers and empty UA', () => {
    expect(detectInAppBrowser(CHROME_ANDROID)).toBeNull()
    expect(detectInAppBrowser(SAFARI_IOS)).toBeNull()
    expect(detectInAppBrowser('')).toBeNull()
  })
})

describe('isAndroid', () => {
  it('is true only for Android UAs', () => {
    expect(isAndroid(FB_ANDROID)).toBe(true)
    expect(isAndroid(CHROME_ANDROID)).toBe(true)
    expect(isAndroid(FB_IOS)).toBe(false)
    expect(isAndroid('')).toBe(false)
  })
})

describe('androidChromeIntentUrl', () => {
  it('keeps host, path and query and targets Chrome over https', () => {
    expect(androidChromeIntentUrl('https://7aba.app/pricing?plan=starter&utm_source=fb')).toBe(
      'intent://7aba.app/pricing?plan=starter&utm_source=fb#Intent;scheme=https;package=com.android.chrome;end;',
    )
  })

  it('drops the hash fragment and handles the root path', () => {
    expect(androidChromeIntentUrl('https://7aba.app/#top')).toBe(
      'intent://7aba.app/#Intent;scheme=https;package=com.android.chrome;end;',
    )
  })

  it('keeps a non-default port in the host', () => {
    expect(androidChromeIntentUrl('http://localhost:3001/dashboard')).toBe(
      'intent://localhost:3001/dashboard#Intent;scheme=https;package=com.android.chrome;end;',
    )
  })

  it('throws on an invalid URL', () => {
    expect(() => androidChromeIntentUrl('not a url')).toThrow()
  })
})
