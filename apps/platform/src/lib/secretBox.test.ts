import { describe, it, expect } from 'vitest'
import { encryptSecret, decryptSecret, isEncrypted, generateKey } from './secretBox'

const KEY = 'z7Zq3pQm1sVn8xYbK4dHtL6eR0aWfJcUgO2iN5vT9uE='
const OTHER_KEY = 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1U='

describe('secretBox', () => {
  it('round-trips a secret', async () => {
    const box = await encryptSecret('cf-token-abc123', KEY)
    expect(await decryptSecret(box, KEY)).toBe('cf-token-abc123')
  })

  it('never emits the plaintext in the envelope', async () => {
    const box = await encryptSecret('cf-token-abc123', KEY)
    expect(box).not.toContain('cf-token-abc123')
    expect(box.startsWith('v1.')).toBe(true)
  })

  it('produces a different envelope each time (random IV)', async () => {
    const a = await encryptSecret('same', KEY)
    const b = await encryptSecret('same', KEY)
    expect(a).not.toBe(b)
    expect(await decryptSecret(a, KEY)).toBe(await decryptSecret(b, KEY))
  })

  it('refuses to decrypt with the wrong key', async () => {
    const box = await encryptSecret('cf-token-abc123', KEY)
    await expect(decryptSecret(box, OTHER_KEY)).rejects.toThrow()
  })

  it('refuses to decrypt a tampered envelope', async () => {
    const box = await encryptSecret('cf-token-abc123', KEY)
    const [v, iv, ct] = box.split('.')
    const flipped = ct[0] === 'A' ? `B${ct.slice(1)}` : `A${ct.slice(1)}`
    await expect(decryptSecret(`${v}.${iv}.${flipped}`, KEY)).rejects.toThrow()
  })

  it('round-trips unicode and long values', async () => {
    const secret = `متجر-${'x'.repeat(500)}-🔐`
    expect(await decryptSecret(await encryptSecret(secret, KEY), KEY)).toBe(secret)
  })

  // Tokens saved before this change are stored as plaintext. Readers must be
  // able to tell the two apart so an existing store keeps deploying.
  it('recognises which values are enveloped', async () => {
    expect(isEncrypted(await encryptSecret('x', KEY))).toBe(true)
    expect(isEncrypted('raw-cloudflare-token')).toBe(false)
    expect(isEncrypted('')).toBe(false)
    expect(isEncrypted(undefined)).toBe(false)
  })

  it('passes legacy plaintext through decryptSecret unchanged', async () => {
    expect(await decryptSecret('raw-cloudflare-token', KEY)).toBe('raw-cloudflare-token')
  })

  it('rejects a key that is not 32 bytes', async () => {
    await expect(encryptSecret('x', 'c2hvcnQ=')).rejects.toThrow(/32 bytes/)
  })

  it('generates keys that work', async () => {
    const key = generateKey()
    expect(await decryptSecret(await encryptSecret('hello', key), key)).toBe('hello')
  })
})
