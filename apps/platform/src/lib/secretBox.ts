/**
 * Authenticated encryption for merchant secrets held at rest in InstantDB.
 *
 * Merchants hand us long-lived credentials (a Cloudflare API token that can
 * edit Pages on their account, their store's InstantDB admin token). Those used
 * to sit in the `stores` row in plaintext, which meant anything that could read
 * the row — a dashboard query, a leaked admin token, a database export — could
 * take over the merchant's Cloudflare account.
 *
 * Here they are sealed with AES-256-GCM under a key that lives only in server
 * runtime config: the `STORE_SECRET_KEY` Cloudflare Pages secret (platform, for
 * writes) and the matching GitHub Actions secret (CI, for the deploy read).
 * The browser never sees the key, so it can no longer read a token back out.
 *
 * This is encryption at rest, and it is worth being precise about what that
 * buys: it defends the tokens against anyone who gets at the *database*. It
 * cannot defend them against someone who compromises the platform worker or a
 * CI runner, because both must be able to decrypt to do their job.
 *
 * Uses WebCrypto only, so the exact same module runs in the Cloudflare Worker,
 * in Node 20+ for the CI scripts, and under vitest.
 */

const VERSION = 'v1'
const IV_BYTES = 12 // 96-bit nonce, the size GCM is specified for
const KEY_BYTES = 32 // AES-256

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  let raw: Uint8Array
  try {
    raw = fromBase64(keyB64)
  } catch {
    throw new Error('STORE_SECRET_KEY is not valid base64')
  }
  if (raw.length !== KEY_BYTES) {
    throw new Error(`STORE_SECRET_KEY must decode to ${KEY_BYTES} bytes, got ${raw.length}`)
  }
  return crypto.subtle.importKey('raw', raw as BufferSource, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

/** True when `value` is one of our envelopes rather than a legacy plaintext secret. */
export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith(`${VERSION}.`) && value.split('.').length === 3
}

/** Seals `plaintext`, returning `v1.<iv>.<ciphertext+tag>`, all base64. */
export async function encryptSecret(plaintext: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64)
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext) as BufferSource
  )
  return `${VERSION}.${toBase64(iv)}.${toBase64(new Uint8Array(ct))}`
}

/**
 * Opens an envelope produced by `encryptSecret`.
 *
 * A value that is not an envelope is returned untouched: secrets written before
 * this change are plaintext, and a merchant whose store still holds one must
 * keep deploying. Rotating them happens on the merchant's next save.
 *
 * Throws if the envelope was made with a different key or has been altered —
 * GCM authenticates the ciphertext, so tampering fails loudly instead of
 * yielding garbage that we would go on to hand to Cloudflare.
 */
export async function decryptSecret(value: string, keyB64: string): Promise<string> {
  if (!isEncrypted(value)) return value

  const [, ivB64, ctB64] = value.split('.')
  const key = await importKey(keyB64)
  let plain: ArrayBuffer
  try {
    plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(ivB64) as BufferSource },
      key,
      fromBase64(ctB64) as BufferSource
    )
  } catch {
    // Deliberately vague: the caller logs this, and the failure mode (wrong key
    // vs. tampered payload) is not something we want to leak.
    throw new Error('Could not decrypt secret — wrong STORE_SECRET_KEY or corrupted value')
  }
  return new TextDecoder().decode(plain)
}

/** Mints a fresh base64 STORE_SECRET_KEY. Used by scripts/generate-secret-key.mjs. */
export function generateKey(): string {
  return toBase64(crypto.getRandomValues(new Uint8Array(KEY_BYTES)))
}
