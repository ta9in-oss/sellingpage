/**
 * Founding-member ("early believer") perk code.
 *
 * Issued once per subscriber at first successful purchase and stored on their
 * platformUsers record. It carries no redemption logic yet — it is a durable
 * handle we can honor across future ta9in products (early access, invite
 * credits, reductions…). Storing it now means holders are verifiable later.
 *
 * Alphabet excludes visually ambiguous characters (0/O, 1/I/L) so the code
 * reads cleanly off a printed/downloaded certificate.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateFounderCode(): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  const body = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
  return `TA9IN-7ABA-${body}`
}
