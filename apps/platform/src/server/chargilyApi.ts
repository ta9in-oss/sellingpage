/**
 * Thin Chargily Pay v2 API wrapper.
 *
 * Why not use @chargily/chargily-pay SDK?
 * In local Node.js dev, the SDK uses undici/fetch which negotiates HTTP/2 (h2)
 * via ALPN. Cloudflare then expects HTTP/2 framing, but undici falls back to
 * HTTP/1.1 framing — the connection hangs with ETIMEDOUT.
 * Forcing ALPNProtocols: ['http/1.1'] on the https.request bypasses this.
 * In production (CF Workers), native fetch works fine — no ALPN mismatch.
 */

interface ChargilyCustomer {
  id: string
  email: string
  name: string
}

interface ChargilyCheckout {
  id: string
  checkout_url: string
  status: string
}

export function getChargilyBaseUrl(secretKey: string) {
  return secretKey.startsWith('test_')
    ? 'https://pay.chargily.net/test/api/v2'
    : 'https://pay.chargily.net/api/v2'
}

async function chargilyRequest<T>(
  endpoint: string,
  body: object,
  secretKey: string,
): Promise<T> {
  const baseUrl = getChargilyBaseUrl(secretKey)
  const url = `${baseUrl}${endpoint}`
  const data = JSON.stringify(body)

  // CF Workers / edge: no 'process' — use native fetch (works fine there)
  if (typeof process === 'undefined' || !process.versions?.node) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: data,
    })
    const json = (await res.json()) as T & { message?: string }
    if (!res.ok) throw new Error(`Chargily ${res.status}: ${json.message ?? JSON.stringify(json)}`)
    return json
  }

  // Node.js (local dev): use https module with ALPNProtocols: ['http/1.1']
  // to prevent Cloudflare from negotiating HTTP/2 and then hanging.
  const { default: https } = await import('node:https')
  const { URL } = await import('node:url')
  const parsed = new URL(url)

  return new Promise<T>((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'User-Agent': 'Mozilla/5.0 7aba-store/1.0',
        },
        ALPNProtocols: ['http/1.1'],
      },
      (res) => {
        let responseData = ''
        res.on('data', (chunk) => (responseData += chunk))
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData) as T & { message?: string }
            if (res.statusCode && res.statusCode >= 400) {
              reject(
                new Error(
                  `Chargily ${res.statusCode}: ${(parsed as { message?: string }).message ?? responseData}`,
                ),
              )
            } else {
              resolve(parsed)
            }
          } catch {
            reject(new Error(`Chargily parse error: ${responseData.slice(0, 200)}`))
          }
        })
      },
    )
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

export async function createChargilyCustomer(
  secretKey: string,
  name: string,
  email: string,
): Promise<ChargilyCustomer> {
  return chargilyRequest<ChargilyCustomer>('/customers', { name, email }, secretKey)
}

export async function createChargilyCheckout(
  secretKey: string,
  params: {
    amount: number
    currency: string
    success_url: string
    failure_url: string
    description?: string
    locale?: string
    customer_id: string
    metadata?: Record<string, string>
  },
): Promise<ChargilyCheckout> {
  return chargilyRequest<ChargilyCheckout>('/checkouts', params, secretKey)
}

export async function getChargilyCheckout(
  secretKey: string,
  checkoutId: string,
): Promise<{ id: string; status: string }> {
  const baseUrl = getChargilyBaseUrl(secretKey)
  const url = `${baseUrl}/checkouts/${checkoutId}`

  if (typeof process === 'undefined' || !process.versions?.node) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    return res.json() as Promise<{ id: string; status: string }>
  }

  const { default: https } = await import('node:https')
  const { URL } = await import('node:url')
  const parsed = new URL(url)

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'User-Agent': 'Mozilla/5.0 7aba-store/1.0',
        },
        ALPNProtocols: ['http/1.1'],
      },
      (res) => {
        let responseData = ''
        res.on('data', (chunk) => (responseData += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(responseData) as { id: string; status: string })
          } catch {
            reject(new Error(`Parse error: ${responseData.slice(0, 200)}`))
          }
        })
      },
    )
    req.on('error', reject)
    req.end()
  })
}
