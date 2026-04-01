import { createServerFn } from '@tanstack/react-start'

/**
 * Exchanges a Cloudflare OAuth authorization code for an access token.
 *
 * Runs server-side to protect CF_OAUTH_CLIENT_SECRET.
 * Returns the access token and the user's first Cloudflare account ID.
 */
export const exchangeCloudflareOAuth = createServerFn({ method: 'POST' })
  .validator((data: unknown) => data as { code: string; redirectUri: string })
  .handler(async ({ data: { code, redirectUri } }) => {
    const clientId = process.env['CF_OAUTH_CLIENT_ID']
    const clientSecret = process.env['CF_OAUTH_CLIENT_SECRET']

    if (!clientId || !clientSecret) {
      throw new Error('Cloudflare OAuth is not configured (CF_OAUTH_CLIENT_ID / CF_OAUTH_CLIENT_SECRET missing)')
    }

    // Exchange auth code for access token
    const tokenRes = await fetch('https://dash.cloudflare.com/oauth2/token', {
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

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new Error(`CF token exchange failed: ${err}`)
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string }

    // Fetch the user's first account ID
    const accountsRes = await fetch('https://api.cloudflare.com/client/v4/accounts', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const accountsJson = (await accountsRes.json()) as {
      result?: { id: string; name: string }[]
    }
    const accountId = accountsJson.result?.[0]?.id ?? ''

    return { accessToken: access_token, accountId }
  })
