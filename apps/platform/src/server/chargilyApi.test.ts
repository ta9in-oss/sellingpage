import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { EventEmitter } from 'node:events'

// node:https is only reached on the real-Node path; mock it so no socket opens.
const { request } = vi.hoisted(() => ({ request: vi.fn() }))
vi.mock('node:https', () => ({ default: { request } }))

import {
  getChargilyBaseUrl,
  createChargilyCustomer,
  createChargilyCheckout,
  getChargilyCheckout,
} from './chargilyApi'

const TEST_KEY = 'test_sk_abc'
const LIVE_KEY = 'live_sk_xyz'

function jsonResponse(status: number, body: unknown) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Make chargilyApi believe it runs inside Cloudflare Workers → native fetch path. */
function asWorkers() {
  vi.stubGlobal('WebSocketPair', class {})
}

/** Fake https.request: replies with `status` + `body` once the request is ended. */
function httpsReplies(status: number, body: string) {
  const sent: { options?: Record<string, unknown>; written: string } = { written: '' }
  request.mockImplementation((options: Record<string, unknown>, cb: (res: EventEmitter) => void) => {
    sent.options = options
    const req = new EventEmitter() as EventEmitter & { write: (s: string) => void; end: () => void }
    req.write = (s) => (sent.written += s)
    req.end = () => {
      const res = Object.assign(new EventEmitter(), { statusCode: status })
      cb(res)
      res.emit('data', body)
      res.emit('end')
    }
    return req
  })
  return sent
}

afterEach(() => {
  vi.unstubAllGlobals()
  request.mockReset()
})

describe('getChargilyBaseUrl', () => {
  it('routes test_ keys to the sandbox and everything else to live', () => {
    expect(getChargilyBaseUrl(TEST_KEY)).toBe('https://pay.chargily.net/test/api/v2')
    expect(getChargilyBaseUrl(LIVE_KEY)).toBe('https://pay.chargily.net/api/v2')
    expect(getChargilyBaseUrl('sk_test_')).toBe('https://pay.chargily.net/api/v2')
  })
})

describe('Workers runtime (native fetch)', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    asWorkers()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('createChargilyCustomer POSTs name+email with bearer auth to the sandbox', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'cus_1', name: 'Ali', email: 'a@b.dz' }))
    await expect(createChargilyCustomer(TEST_KEY, 'Ali', 'a@b.dz')).resolves.toEqual({
      id: 'cus_1',
      name: 'Ali',
      email: 'a@b.dz',
    })
    expect(request).not.toHaveBeenCalled()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://pay.chargily.net/test/api/v2/customers')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ Authorization: `Bearer ${TEST_KEY}`, 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual({ name: 'Ali', email: 'a@b.dz' })
  })

  it('createChargilyCheckout POSTs the params verbatim to /checkouts on live', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'co_1', checkout_url: 'https://pay/x', status: 'pending' }))
    const params = {
      amount: 2000,
      currency: 'dzd',
      success_url: 'https://7aba.app/ok',
      failure_url: 'https://7aba.app/ko',
      customer_id: 'cus_1',
      metadata: { tier: 'starter' },
    }
    const res = await createChargilyCheckout(LIVE_KEY, params)
    expect(res.checkout_url).toBe('https://pay/x')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://pay.chargily.net/api/v2/checkouts')
    expect(JSON.parse(init.body)).toEqual(params)
  })

  it('throws with status and API message on a non-2xx POST', async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, { message: 'The amount must be at least 50.' }))
    await expect(createChargilyCustomer(TEST_KEY, 'A', 'a@b.dz')).rejects.toThrow(
      'Chargily 422: The amount must be at least 50.',
    )
  })

  it('falls back to the serialized body when the error has no message', async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { errors: ['boom'] }))
    await expect(createChargilyCustomer(TEST_KEY, 'A', 'a@b.dz')).rejects.toThrow(
      'Chargily 500: {"errors":["boom"]}',
    )
  })

  it('getChargilyCheckout GETs the checkout by id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'co_9', status: 'paid', amount: 2000, metadata: { tier: 'pro' } }))
    await expect(getChargilyCheckout(TEST_KEY, 'co_9')).resolves.toEqual({
      id: 'co_9',
      status: 'paid',
      amount: 2000,
      metadata: { tier: 'pro' },
    })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://pay.chargily.net/test/api/v2/checkouts/co_9')
    expect(init).toEqual({ headers: { Authorization: `Bearer ${TEST_KEY}` } })
  })

  it('getChargilyCheckout throws with a truncated body on non-2xx', async () => {
    fetchMock.mockResolvedValue(new Response('x'.repeat(500), { status: 404 }))
    await expect(getChargilyCheckout(TEST_KEY, 'nope')).rejects.toThrow(`Chargily 404: ${'x'.repeat(200)}`)
  })

  it('also detects Workers via navigator.userAgent', async () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('navigator', { userAgent: 'Cloudflare-Workers' })
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'cus_2', name: 'n', email: 'e' }))
    await createChargilyCustomer(TEST_KEY, 'n', 'e')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(request).not.toHaveBeenCalled()
  })
})

describe('Node runtime (https with HTTP/1.1 ALPN)', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('POSTs via https.request forcing http/1.1 and resolves the parsed JSON', async () => {
    const sent = httpsReplies(200, JSON.stringify({ id: 'cus_1', name: 'Ali', email: 'a@b.dz' }))
    await expect(createChargilyCustomer(TEST_KEY, 'Ali', 'a@b.dz')).resolves.toEqual({
      id: 'cus_1',
      name: 'Ali',
      email: 'a@b.dz',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    const body = JSON.stringify({ name: 'Ali', email: 'a@b.dz' })
    expect(sent.written).toBe(body)
    expect(sent.options).toMatchObject({
      hostname: 'pay.chargily.net',
      path: '/test/api/v2/customers',
      method: 'POST',
      ALPNProtocols: ['http/1.1'],
      headers: {
        Authorization: `Bearer ${TEST_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    })
  })

  it('computes Content-Length in bytes for non-ASCII payloads', async () => {
    const sent = httpsReplies(200, '{"id":"cus_3"}')
    await createChargilyCustomer(TEST_KEY, 'علي', 'a@b.dz')
    const body = JSON.stringify({ name: 'علي', email: 'a@b.dz' })
    expect((sent.options!.headers as Record<string, number>)['Content-Length']).toBe(Buffer.byteLength(body))
    expect(Buffer.byteLength(body)).toBeGreaterThan(body.length)
  })

  it('rejects with status and message on a >=400 response', async () => {
    httpsReplies(401, JSON.stringify({ message: 'Unauthenticated.' }))
    await expect(createChargilyCheckout(TEST_KEY, {
      amount: 1, currency: 'dzd', success_url: 's', failure_url: 'f', customer_id: 'c',
    })).rejects.toThrow('Chargily 401: Unauthenticated.')
  })

  it('rejects with the raw body when an error response has no message', async () => {
    httpsReplies(500, '{"oops":true}')
    await expect(createChargilyCustomer(TEST_KEY, 'a', 'b')).rejects.toThrow('Chargily 500: {"oops":true}')
  })

  it('rejects with a parse error on non-JSON bodies', async () => {
    httpsReplies(502, '<html>Bad gateway</html>')
    await expect(createChargilyCustomer(TEST_KEY, 'a', 'b')).rejects.toThrow(
      'Chargily parse error: <html>Bad gateway</html>',
    )
  })

  it('propagates socket errors', async () => {
    request.mockImplementation(() => {
      const req = Object.assign(new EventEmitter(), {
        write: () => {},
        end: () => queueMicrotask(() => req.emit('error', new Error('ETIMEDOUT'))),
      })
      return req
    })
    await expect(createChargilyCustomer(TEST_KEY, 'a', 'b')).rejects.toThrow('ETIMEDOUT')
  })

  it('getChargilyCheckout GETs via https and resolves parsed JSON', async () => {
    const sent = httpsReplies(200, JSON.stringify({ id: 'co_1', status: 'paid' }))
    await expect(getChargilyCheckout(LIVE_KEY, 'co_1')).resolves.toEqual({ id: 'co_1', status: 'paid' })
    expect(sent.options).toMatchObject({
      hostname: 'pay.chargily.net',
      path: '/api/v2/checkouts/co_1',
      method: 'GET',
      ALPNProtocols: ['http/1.1'],
    })
  })

  it('getChargilyCheckout rejects on non-JSON bodies', async () => {
    httpsReplies(200, 'not json')
    await expect(getChargilyCheckout(LIVE_KEY, 'co_1')).rejects.toThrow('Parse error: not json')
  })

  it('getChargilyCheckout rejects on a >=400 response, like the fetch path', async () => {
    httpsReplies(404, '{"message":"Not found"}')
    await expect(getChargilyCheckout(LIVE_KEY, 'co_1')).rejects.toThrow('Chargily 404: {"message":"Not found"}')
  })
})
