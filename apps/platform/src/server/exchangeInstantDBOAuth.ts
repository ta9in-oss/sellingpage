import { createServerFn } from '@tanstack/react-start'

/**
 * Exchanges an InstantDB Platform OAuth authorization code for tokens.
 * Runs server-side to protect INSTANTDB_OAUTH_CLIENT_SECRET.
 */
export const exchangeInstantDBOAuth = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as { code: string; redirectUri: string })
  .handler(async ({ data: { code, redirectUri } }) => {
    const clientId = process.env['INSTANTDB_OAUTH_CLIENT_ID']
    const clientSecret = process.env['INSTANTDB_OAUTH_CLIENT_SECRET']
    if (!clientId || !clientSecret) {
      throw new Error('InstantDB OAuth is not configured (INSTANTDB_OAUTH_CLIENT_ID / INSTANTDB_OAUTH_CLIENT_SECRET missing)')
    }
    const res = await fetch('https://api.instantdb.com/platform/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`InstantDB token exchange failed: ${err}`)
    }
    const json = (await res.json()) as { access_token: string; refresh_token?: string }
    return { accessToken: json.access_token, refreshToken: json.refresh_token }
  })
